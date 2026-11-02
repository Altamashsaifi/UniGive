-- UniGive PostgreSQL Database Schema
-- Baseline specification conforming to Technical Specification Page 3 with extended pricing & profile support

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Enumeration Types
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

-- 1. Users Table (with personal profile enhancements)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL CHECK (email LIKE '%@%.ac.in' OR email LIKE '%@%.edu%'),
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    semester INT,
    social_handle VARCHAR(100),
    phone VARCHAR(20),
    hostel_block VARCHAR(100),
    bio TEXT,
    role user_role DEFAULT 'STUDENT',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Giveaways Table (Listings) (supports FREE, BARTER, AMOUNT)
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category item_category NOT NULL,
    condition item_condition NOT NULL,
    give_type give_type DEFAULT 'FREE',
    price NUMERIC(10, 2) DEFAULT 0.00,
    exchange_for TEXT,
    image_url TEXT,
    pickup_location VARCHAR(150),
    status listing_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seeker Requests Table
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seeker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category item_category NOT NULL,
    is_fulfilled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_donor_id ON listings(donor_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_category ON requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_seeker_id ON requests(seeker_id);
CREATE INDEX IF NOT EXISTS idx_requests_is_fulfilled ON requests(is_fulfilled);
