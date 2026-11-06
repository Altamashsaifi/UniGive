-- ====================================================================
-- UniGive Dummy Showcase Listings Seed for Supabase
-- ====================================================================
-- Run this in your Supabase Dashboard:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ====================================================================

DO $$
DECLARE
    v_donor1 UUID;
    v_donor2 UUID;
    v_donor3 UUID;
BEGIN
    -- Select existing profile IDs
    SELECT id INTO v_donor1 FROM public.profiles ORDER BY created_at ASC LIMIT 1;
    SELECT id INTO v_donor2 FROM public.profiles ORDER BY created_at ASC OFFSET 1 LIMIT 1;
    SELECT id INTO v_donor3 FROM public.profiles ORDER BY created_at ASC OFFSET 2 LIMIT 1;

    -- If no second/third donor exists, fall back to the first donor
    IF v_donor2 IS NULL THEN v_donor2 := v_donor1; END IF;
    IF v_donor3 IS NULL THEN v_donor3 := v_donor1; END IF;

    -- Only insert if listings table is currently empty
    IF NOT EXISTS (SELECT 1 FROM public.listings LIMIT 1) THEN
        INSERT INTO public.listings (donor_id, title, description, category, condition, give_type, price, exchange_for, image_url, pickup_location, status)
        VALUES
        (
            v_donor1,
            'Casio FX-991EX ClassWiz Scientific Calculator',
            'Used for 2 semesters, perfect working condition with high-res LCD display. Great for 1st/2nd year Engineering Maths & Physics.',
            'ELECTRONICS',
            'LIKE_NEW',
            'FREE',
            0,
            NULL,
            'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
            'Central Library - 2nd Floor Reading Room',
            'AVAILABLE'
        ),
        (
            v_donor2,
            'Complete Engineering Drawing Mini Drafter + Sheet Holder',
            'Standard mechanical drafter with clamp, scale, and protective cylindrical sheet tube. Clean edges, no cracks.',
            'LAB_EQUIPMENT',
            'GOOD',
            'BARTER',
            0,
            'Semester 4 Microprocessor book or technical drafting pen set',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
            'Hostel Block B - Common Room',
            'AVAILABLE'
        ),
        (
            v_donor3,
            'Fundamentals of Physics (Halliday, Resnick, Walker - 10th Ed)',
            'Standard textbook for Semester 1 & 2 physics courses. Clean pages with highlighted formulas and problem solutions.',
            'BOOKS',
            'GOOD',
            'AMOUNT',
            180,
            NULL,
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
            'Mechanical Dept Workshop Porch',
            'AVAILABLE'
        ),
        (
            v_donor1,
            'White Cotton Lab Coat (Size L, Chest 40)',
            'Standard 100% cotton lab apron with front buttons. Clean and washed, mandatory for chemistry labs.',
            'LAB_EQUIPMENT',
            'LIKE_NEW',
            'FREE',
            0,
            NULL,
            'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
            'Academic Block 1 - Canteen Lounge',
            'RESERVED'
        ),
        (
            v_donor2,
            'Arduino Uno R3 Starter Kit with Jumper Wires & Breadboard',
            'Finished IoT Lab project. Includes microcontroller board, USB programming cable, breadboard, resistors, and LEDs.',
            'ELECTRONICS',
            'GOOD',
            'AMOUNT',
            250,
            NULL,
            'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
            'Tech Hub / Robotics Lab 304',
            'AVAILABLE'
        ),
        (
            v_donor1,
            'Introduction to Algorithms (CLRS 3rd Edition)',
            'Comprehensive core text for Data Structures & Algorithms. Clean pages, hardcover edition in great condition.',
            'BOOKS',
            'LIKE_NEW',
            'FREE',
            0,
            NULL,
            'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&auto=format&fit=crop&q=80',
            'Central Library - Circulation Desk',
            'AVAILABLE'
        ),
        (
            v_donor2,
            'Rotring & Staedtler Technical Drafting Stencil Set (Circle + Isometric)',
            'Essential drafting tools for Engineering Graphics assignments. Includes circle templates, ellipse guide, and compass adapter.',
            'STATIONERY',
            'GOOD',
            'FREE',
            0,
            NULL,
            'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
            'Academic Block 2 - Architecture Studio',
            'AVAILABLE'
        ),
        (
            v_donor3,
            'Rechargeable LED Desk Study Lamp (Warm/Cool 3-Level Dimming)',
            'Foldable study lamp with built-in USB rechargeable battery. Great for late-night exam prep in hostel rooms.',
            'OTHER',
            'LIKE_NEW',
            'AMOUNT',
            120,
            NULL,
            'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=600&auto=format&fit=crop&q=80',
            'Hostel Block B - Reception Area',
            'AVAILABLE'
        );
        RAISE NOTICE 'Successfully seeded 8 showcase listings into Supabase public.listings!';
    ELSE
        RAISE NOTICE 'Listings table already contains records. Skipping seed insertion.';
    END IF;
END $$;
