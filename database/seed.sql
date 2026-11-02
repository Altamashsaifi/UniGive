-- UniGive Sample Seed Data for Local Development & Testing

-- Seed Demo Users
INSERT INTO users (id, full_name, email, password_hash, department, semester, social_handle, phone, hostel_block, bio, role, is_verified)
VALUES
    ('11111111-1111-4111-a111-111111111111', 'Altamash Saifi', 'altamash@college.ac.in', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Computer Science & Engineering', 5, '@altamash_dev', '+91 98765 43210', 'Hostel B, Room 214', '5th Sem CSE student passionate about open source and campus sustainability.', 'STUDENT', true),
    ('22222222-2222-4222-a222-222222222222', 'Abhishek Sharma', 'abhishek@college.ac.in', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Electronics & Comm.', 7, '@abhi_builds', '+91 98765 12345', 'Hostel A, Room 102', 'ECE Final year. Giving away lab equipment and microcontrollers.', 'STUDENT', true),
    ('33333333-3333-4333-a333-333333333333', 'Afifa Khan', 'afifa@college.ac.in', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Mechanical Engineering', 3, '@afifa_tech', '+91 98765 67890', 'Girls Hostel Block 2', '3rd Sem Mech. Looking for textbooks and sharing drafters.', 'STUDENT', true),
    ('44444444-4444-4444-a444-444444444444', 'Abhinav Patel', 'abhinav@college.ac.in', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Information Technology', 5, '@abhinav_qa', '+91 98765 99887', 'Day Scholar (South Campus)', 'QA & Security lead. Always happy to lend lab coats.', 'STUDENT', true)
ON CONFLICT (email) DO NOTHING;

-- Seed Sample Giveaway Listings with Free, Barter, and Amount
INSERT INTO listings (id, donor_id, title, description, category, condition, give_type, price, exchange_for, image_url, pickup_location, status)
VALUES
    (
        'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
        '11111111-1111-4111-a111-111111111111',
        'Casio FX-991EX ClassWiz Scientific Calculator',
        'Used for 2 semesters, perfect working condition with high-res LCD display. Great for 1st/2nd year Engineering Maths & Physics.',
        'ELECTRONICS',
        'LIKE_NEW',
        'FREE',
        0.00,
        NULL,
        'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
        'Central Library - 2nd Floor Reading Room',
        'AVAILABLE'
    ),
    (
        'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
        '22222222-2222-4222-a222-222222222222',
        'Complete Engineering Drawing Mini Drafter + Sheet Holder',
        'Standard mechanical drafter with clamp, scale, and protective cylindrical sheet tube. Clean edges, no cracks.',
        'LAB_EQUIPMENT',
        'GOOD',
        'BARTER',
        0.00,
        'Exchange for Semester 4 Microprocessor reference book or drafting pen set',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        'Hostel Block B - Common Room',
        'AVAILABLE'
    ),
    (
        'cccccccc-cccc-4ccc-cccc-cccccccccccc',
        '33333333-3333-4333-a333-333333333333',
        'Fundamentals of Physics (Halliday, Resnick, Walker - 10th Ed)',
        'Standard textbook for Semester 1 & 2 physics courses. Clean pages with highlighted formulas and problem solutions.',
        'BOOKS',
        'GOOD',
        'AMOUNT',
        180.00,
        NULL,
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'Mechanical Dept Workshop Porch',
        'AVAILABLE'
    ),
    (
        'dddddddd-dddd-4ddd-dddd-dddddddddddd',
        '44444444-4444-4444-a444-444444444444',
        'White Cotton Lab Coat (Size L, Chest 40)',
        'Required for Chemistry Lab and Physics practicals. Clean, washed, no chemical stains or rips.',
        'LAB_EQUIPMENT',
        'LIKE_NEW',
        'FREE',
        0.00,
        NULL,
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
        'Academic Block 1 - Canteen Lounge',
        'RESERVED'
    ),
    (
        'eeeeeeee-eeee-4eee-eeee-eeeeeeeeeeee',
        '11111111-1111-4111-a111-111111111111',
        'Arduino Uno R3 Starter Kit with Jumper Wires & Breadboard',
        'Completed IoT laboratory course. Giving away the microcontroller, breadboard, resistors, and basic sensors.',
        'ELECTRONICS',
        'GOOD',
        'AMOUNT',
        250.00,
        NULL,
        'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
        'Tech Hub / Robotics Lab 304',
        'AVAILABLE'
    )
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Seeker Requests
INSERT INTO requests (id, seeker_id, title, description, category, is_fulfilled)
VALUES
    (
        '10101010-1010-4010-a010-101010101010',
        '33333333-3333-4333-a333-333333333333',
        'Need Introduction to Algorithms (CLRS 3rd/4th Edition)',
        'Taking Data Structures and Algorithms this semester. Looking for a physical copy to prepare for midterm exams.',
        'BOOKS',
        false
    ),
    (
        '20202020-2020-4020-a020-202020202020',
        '44444444-4444-4444-a444-444444444444',
        'Soldering Iron & Stand for Final Year Mini-Project',
        'Need a 25W/35W soldering iron for 2 weeks to assemble PCB prototype for the Embedded Systems course.',
        'LAB_EQUIPMENT',
        false
    ),
    (
        '30303030-3030-4030-a030-303030303030',
        '22222222-2222-4222-a222-222222222222',
        'Rotring / Staedtler Technical Drawing Stencil Set',
        'Need circle and isometric projection stencils for Engineering Graphics drawing submissions.',
        'STATIONERY',
        false
    )
ON CONFLICT (id) DO NOTHING;
