-- ====================================================================
-- UniGive Supabase Database Schema & Setup Script
-- Verified Campus Peer-to-Peer Redistribution System
-- ====================================================================
-- Run this entire script in your Supabase Dashboard:
-- Go to: Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ====================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumeration Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_condition AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('AVAILABLE', 'RESERVED', 'CLAIMED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_category AS ENUM ('BOOKS', 'LAB_EQUIPMENT', 'ELECTRONICS', 'STATIONERY', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE give_type AS ENUM ('FREE', 'BARTER', 'AMOUNT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ====================================================================
-- 3. Public Profiles Table (mirrors Supabase auth.users)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100),
    semester INT,
    social_handle VARCHAR(100),
    phone VARCHAR(20),
    hostel_block VARCHAR(100),
    bio TEXT,
    role user_role DEFAULT 'STUDENT',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 4. Giveaways / Listings Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category item_category NOT NULL DEFAULT 'BOOKS',
    condition item_condition NOT NULL DEFAULT 'GOOD',
    give_type give_type NOT NULL DEFAULT 'FREE',
    price NUMERIC(10, 2) DEFAULT 0.00,
    exchange_for TEXT,
    image_url TEXT,
    pickup_location VARCHAR(150),
    status listing_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 5. Seeker Requests Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seeker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category item_category NOT NULL DEFAULT 'BOOKS',
    is_fulfilled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_donor_id ON public.listings(donor_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_category ON public.requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_seeker_id ON public.requests(seeker_id);
CREATE INDEX IF NOT EXISTS idx_requests_is_fulfilled ON public.requests(is_fulfilled);

-- ====================================================================
-- 6. Trigger: Automatically create public.profiles on Auth Sign-Up
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    user_name TEXT;
    user_dept TEXT;
    user_sem INT;
    user_role_val public.user_role;
BEGIN
    -- 1. Safely extract user's name
    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    
    -- 2. Safely extract department
    user_dept := COALESCE(NEW.raw_user_meta_data->>'department', 'Engineering');
    
    -- 3. Safely parse semester (handles empty strings or missing numbers without crashing)
    BEGIN
        user_sem := COALESCE(NULLIF(NEW.raw_user_meta_data->>'semester', '')::INT, 1);
    EXCEPTION WHEN OTHERS THEN
        user_sem := 1;
    END;

    -- 4. Safely resolve role
    IF (NEW.raw_user_meta_data->>'role' = 'ADMIN' OR NEW.raw_user_meta_data->>'is_admin' = 'true') THEN
        user_role_val := 'ADMIN'::public.user_role;
    ELSE
        user_role_val := 'STUDENT'::public.user_role;
    END IF;

    -- 5. Insert profile with conflict resolution
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        department,
        semester,
        social_handle,
        phone,
        hostel_block,
        bio,
        role,
        is_verified
    )
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        user_dept,
        user_sem,
        COALESCE(NEW.raw_user_meta_data->>'social_handle', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'hostel_block', ''),
        COALESCE(NEW.raw_user_meta_data->>'bio', ''),
        user_role_val,
        (NEW.email LIKE '%@%.ac.in' OR NEW.email LIKE '%@%.edu%' OR user_role_val = 'ADMIN')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        department = EXCLUDED.department,
        semester = EXCLUDED.semester,
        updated_at = CURRENT_TIMESTAMP;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Fallback safety net: logs warning but NEVER aborts user signup
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop trigger if already exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 7. Row Level Security (RLS) Policies
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Listings Policies
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON public.listings;
CREATE POLICY "Listings are viewable by everyone"
    ON public.listings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create listings" ON public.listings;
CREATE POLICY "Authenticated users can create listings"
    ON public.listings FOR INSERT
    WITH CHECK (auth.uid() = donor_id);

DROP POLICY IF EXISTS "Donors can update their own listings" ON public.listings;
CREATE POLICY "Donors can update their own listings"
    ON public.listings FOR UPDATE
    USING (
        auth.uid() = donor_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
    );

DROP POLICY IF EXISTS "Donors can delete their own listings" ON public.listings;
CREATE POLICY "Donors can delete their own listings"
    ON public.listings FOR DELETE
    USING (
        auth.uid() = donor_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- Requests Policies
DROP POLICY IF EXISTS "Requests are viewable by everyone" ON public.requests;
CREATE POLICY "Requests are viewable by everyone"
    ON public.requests FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create requests" ON public.requests;
CREATE POLICY "Authenticated users can create requests"
    ON public.requests FOR INSERT
    WITH CHECK (auth.uid() = seeker_id);

DROP POLICY IF EXISTS "Seekers can update their own requests" ON public.requests;
CREATE POLICY "Seekers can update their own requests"
    ON public.requests FOR UPDATE
    USING (
        auth.uid() = seeker_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
    );

DROP POLICY IF EXISTS "Seekers can delete their own requests" ON public.requests;
CREATE POLICY "Seekers can delete their own requests"
    ON public.requests FOR DELETE
    USING (
        auth.uid() = seeker_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ====================================================================
-- 8. Storage Bucket for Item Photos (Optional but recommended)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-photos', 'item-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Item photos are publicly accessible" ON storage.objects;
CREATE POLICY "Item photos are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'item-photos');

DROP POLICY IF EXISTS "Authenticated users can upload item photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload item photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'item-photos' AND auth.role() = 'authenticated');

-- ====================================================================
-- 9. Permissions & Grants
-- ====================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;


