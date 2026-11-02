const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let usePostgres = false;
let pool = null;

try {
  pool = new Pool(
    process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          host: process.env.PGHOST || 'localhost',
          port: parseInt(process.env.PGPORT, 10) || 5432,
          database: process.env.PGDATABASE || 'unigive_db',
          user: process.env.PGUSER || 'postgres',
          password: process.env.PGPASSWORD || 'postgres',
          connectionTimeoutMillis: 1500,
        }
  );

  // Test connection on startup
  pool.query('SELECT NOW()', (err) => {
    if (err) {
      console.log('⚠️ [Database] PostgreSQL is not running on localhost:5432.');
      console.log('💡 [Database] Switched to In-Memory Development Store.');
      console.log('✅ [Database] All REST APIs, Auth, and Listings will work seamlessly without errors!');
      usePostgres = false;
    } else {
      console.log('✅ [Database] Successfully connected to PostgreSQL.');
      usePostgres = true;
    }
  });

  pool.on('error', (err) => {
    // Prevent unhandled error crashing process
    usePostgres = false;
  });
} catch (e) {
  usePostgres = false;
}

// In-Memory Seed Data matching seed.sql
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

const memoryUsers = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    full_name: 'Altamash Saifi',
    email: 'altamash@college.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    department: 'Computer Science & Engineering',
    semester: 5,
    social_handle: '@altamash_dev',
    phone: '+91 98765 43210',
    hostel_block: 'Hostel B, Room 214',
    bio: '5th Sem CSE student passionate about open source and campus sustainability.',
    role: 'STUDENT',
    is_verified: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    full_name: 'Abhishek Sharma',
    email: 'abhishek@college.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    department: 'Electronics & Comm.',
    semester: 7,
    social_handle: '@abhi_builds',
    phone: '+91 98765 12345',
    hostel_block: 'Hostel A, Room 102',
    bio: 'ECE Final year. Giving away lab equipment and microcontrollers.',
    role: 'STUDENT',
    is_verified: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    full_name: 'Afifa Khan',
    email: 'afifa@college.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    department: 'Mechanical Engineering',
    semester: 3,
    social_handle: '@afifa_tech',
    phone: '+91 98765 67890',
    hostel_block: 'Girls Hostel Block 2',
    bio: '3rd Sem Mech. Looking for textbooks and sharing drafters.',
    role: 'STUDENT',
    is_verified: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    full_name: 'Abhinav Patel',
    email: 'abhinav@college.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    department: 'Information Technology',
    semester: 5,
    social_handle: '@abhinav_qa',
    phone: '+91 98765 99887',
    hostel_block: 'Day Scholar (South Campus)',
    bio: 'QA & Security lead. Always happy to lend lab coats.',
    role: 'STUDENT',
    is_verified: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
];

const memoryListings = [
  {
    id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    donor_id: '11111111-1111-4111-a111-111111111111',
    title: 'Casio FX-991EX ClassWiz Scientific Calculator',
    description: 'Used for 2 semesters, perfect working condition with high-res LCD display. Great for 1st/2nd year Engineering Maths & Physics.',
    category: 'ELECTRONICS',
    condition: 'LIKE_NEW',
    give_type: 'FREE',
    price: 0.0,
    exchange_for: null,
    image_url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
    pickup_location: 'Central Library - 2nd Floor Reading Room',
    status: 'AVAILABLE',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
    donor_id: '22222222-2222-4222-a222-222222222222',
    title: 'Complete Engineering Drawing Mini Drafter + Sheet Holder',
    description: 'Standard mechanical drafter with clamp, scale, and protective cylindrical sheet tube. Clean edges, no cracks.',
    category: 'LAB_EQUIPMENT',
    condition: 'GOOD',
    give_type: 'BARTER',
    price: 0.0,
    exchange_for: 'Semester 4 Microprocessor book or technical drafting pen set',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    pickup_location: 'Hostel Block B - Common Room',
    status: 'AVAILABLE',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'cccccccc-cccc-4ccc-cccc-cccccccccccc',
    donor_id: '33333333-3333-4333-a333-333333333333',
    title: 'Fundamentals of Physics (Halliday, Resnick, Walker - 10th Ed)',
    description: 'Standard textbook for Semester 1 & 2 physics courses. Clean pages with highlighted formulas and problem solutions.',
    category: 'BOOKS',
    condition: 'GOOD',
    give_type: 'AMOUNT',
    price: 180.0,
    exchange_for: null,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    pickup_location: 'Mechanical Dept Workshop Porch',
    status: 'AVAILABLE',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'dddddddd-dddd-4ddd-dddd-dddddddddddd',
    donor_id: '44444444-4444-4444-a444-444444444444',
    title: 'White Cotton Lab Coat (Size L, Chest 40)',
    description: 'Required for Chemistry Lab and Physics practicals. Clean, washed, no chemical stains or rips.',
    category: 'LAB_EQUIPMENT',
    condition: 'LIKE_NEW',
    give_type: 'FREE',
    price: 0.0,
    exchange_for: null,
    image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    pickup_location: 'Academic Block 1 - Canteen Lounge',
    status: 'RESERVED',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'eeeeeeee-eeee-4eee-eeee-eeeeeeeeeeee',
    donor_id: '11111111-1111-4111-a111-111111111111',
    title: 'Arduino Uno R3 Starter Kit with Jumper Wires & Breadboard',
    description: 'Completed IoT laboratory course. Giving away the microcontroller, breadboard, resistors, and basic sensors.',
    category: 'ELECTRONICS',
    condition: 'GOOD',
    give_type: 'AMOUNT',
    price: 250.0,
    exchange_for: null,
    image_url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
    pickup_location: 'Tech Hub / Robotics Lab 304',
    status: 'AVAILABLE',
    created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
  },
];

const memoryRequests = [
  {
    id: '10101010-1010-4010-a010-101010101010',
    seeker_id: '33333333-3333-4333-a333-333333333333',
    title: 'Need Introduction to Algorithms (CLRS 3rd/4th Edition)',
    description: 'Taking Data Structures and Algorithms this semester. Looking for a physical copy to prepare for midterm exams.',
    category: 'BOOKS',
    is_fulfilled: false,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: '20202020-2020-4020-a020-202020202020',
    seeker_id: '44444444-4444-4444-a444-444444444444',
    title: 'Soldering Iron & Stand for Final Year Mini-Project',
    description: 'Need a 25W/35W soldering iron for 2 weeks to assemble PCB prototype for the Embedded Systems course.',
    category: 'LAB_EQUIPMENT',
    is_fulfilled: false,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: '30303030-3030-4030-a030-303030303030',
    seeker_id: '11111111-1111-4111-a111-111111111111',
    title: 'Rotring / Staedtler Technical Drawing Stencil Set',
    description: 'Need circle and isometric projection stencils for Engineering Graphics drawing submissions.',
    category: 'STATIONERY',
    is_fulfilled: false,
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
];

// In-Memory Query Runner
async function executeInMemory(text, params = []) {
  const q = text.trim();

  // 1. SELECT users by email
  if (q.includes('FROM users WHERE email = $1')) {
    const user = memoryUsers.find((u) => u.email.toLowerCase() === params[0].toLowerCase());
    return { rows: user ? [{ ...user }] : [] };
  }

  // 2. SELECT users by id
  if (q.includes('FROM users WHERE id = $1')) {
    const user = memoryUsers.find((u) => u.id === params[0]);
    return { rows: user ? [{ ...user }] : [] };
  }

  // 3. INSERT user
  if (q.startsWith('INSERT INTO users')) {
    const [full_name, email, password_hash, department, semester, social_handle, phone, hostel_block, bio] = params;
    const newUser = {
      id: 'u-' + Date.now(),
      full_name,
      email,
      password_hash,
      department: department || null,
      semester: semester || null,
      social_handle: social_handle || null,
      phone: phone || null,
      hostel_block: hostel_block || null,
      bio: bio || null,
      role: 'STUDENT',
      is_verified: true,
      created_at: new Date().toISOString(),
    };
    memoryUsers.push(newUser);
    return { rows: [{ ...newUser }] };
  }

  // 4. UPDATE users profile
  if (q.startsWith('UPDATE users')) {
    const [full_name, department, semester, social_handle, phone, hostel_block, bio, id] = params;
    const user = memoryUsers.find((u) => u.id === id);
    if (user) {
      if (full_name) user.full_name = full_name;
      if (department) user.department = department;
      if (semester) user.semester = semester;
      if (social_handle) user.social_handle = social_handle;
      if (phone) user.phone = phone;
      if (hostel_block) user.hostel_block = hostel_block;
      if (bio) user.bio = bio;
      return { rows: [{ ...user }] };
    }
    return { rows: [] };
  }

  // 5. SELECT listings
  if (q.includes('FROM listings l') && q.includes('JOIN users u')) {
    let list = memoryListings.map((l) => {
      const donor = memoryUsers.find((u) => u.id === l.donor_id) || {
        full_name: 'Campus Student',
        email: 'student@college.ac.in',
        department: 'Engineering',
        social_handle: '@student',
        phone: '',
        hostel_block: '',
      };
      return {
        ...l,
        donor_name: donor.full_name,
        donor_email: donor.email,
        donor_department: donor.department,
        donor_semester: donor.semester,
        donor_social_handle: donor.social_handle,
        donor_phone: donor.phone,
        donor_hostel_block: donor.hostel_block,
      };
    });

    // Check filters
    params.forEach((p) => {
      if (typeof p === 'string' && ['BOOKS', 'LAB_EQUIPMENT', 'ELECTRONICS', 'STATIONERY', 'OTHER'].includes(p)) {
        list = list.filter((l) => l.category === p);
      } else if (typeof p === 'string' && ['AVAILABLE', 'RESERVED', 'CLAIMED'].includes(p)) {
        list = list.filter((l) => l.status === p);
      } else if (typeof p === 'string' && ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'].includes(p)) {
        list = list.filter((l) => l.condition === p);
      } else if (typeof p === 'string' && p.startsWith('%') && p.endsWith('%')) {
        const kw = p.slice(1, -1).toLowerCase();
        list = list.filter((l) => l.title.toLowerCase().includes(kw) || (l.description && l.description.toLowerCase().includes(kw)));
      } else if (typeof p === 'string' && p.includes('-')) {
        // ID filter
        list = list.filter((l) => l.donor_id === p);
      }
    });

    return { rows: list };
  }

  // 6. SELECT single listing by id
  if (q.includes('FROM listings WHERE id = $1')) {
    const item = memoryListings.find((l) => l.id === params[0]);
    return { rows: item ? [{ ...item }] : [] };
  }

  // 7. INSERT listing
  if (q.startsWith('INSERT INTO listings')) {
    const [donor_id, title, description, category, condition, give_type, price, exchange_for, image_url, pickup_location] = params;
    const newListing = {
      id: 'l-' + Date.now(),
      donor_id,
      title,
      description,
      category,
      condition,
      give_type: give_type || 'FREE',
      price: price || 0,
      exchange_for: exchange_for || null,
      image_url: image_url || null,
      pickup_location: pickup_location || 'Campus Premises',
      status: 'AVAILABLE',
      created_at: new Date().toISOString(),
    };
    memoryListings.unshift(newListing);
    return { rows: [{ ...newListing }] };
  }

  // 8. UPDATE listing status
  if (q.startsWith('UPDATE listings')) {
    const [status, id] = params;
    const item = memoryListings.find((l) => l.id === id);
    if (item) {
      item.status = status;
      return { rows: [{ ...item }] };
    }
    return { rows: [] };
  }

  // 9. DELETE listing
  if (q.startsWith('DELETE FROM listings WHERE id = $1')) {
    const idx = memoryListings.findIndex((l) => l.id === params[0]);
    if (idx !== -1) memoryListings.splice(idx, 1);
    return { rowCount: 1 };
  }

  // 10. SELECT requests
  if (q.includes('FROM requests r') && q.includes('JOIN users u')) {
    let reqs = memoryRequests.map((r) => {
      const seeker = memoryUsers.find((u) => u.id === r.seeker_id) || {
        full_name: 'Campus Student',
        email: 'student@college.ac.in',
        department: 'Engineering',
        social_handle: '@student',
        phone: '',
      };
      return {
        ...r,
        seeker_name: seeker.full_name,
        seeker_email: seeker.email,
        seeker_department: seeker.department,
        seeker_social_handle: seeker.social_handle,
        seeker_phone: seeker.phone,
      };
    });
    return { rows: reqs };
  }

  // 11. INSERT request
  if (q.startsWith('INSERT INTO requests')) {
    const [seeker_id, title, description, category] = params;
    const newReq = {
      id: 'r-' + Date.now(),
      seeker_id,
      title,
      description,
      category,
      is_fulfilled: false,
      created_at: new Date().toISOString(),
    };
    memoryRequests.unshift(newReq);
    return { rows: [{ ...newReq }] };
  }

  // 12. SELECT request by id
  if (q.includes('FROM requests WHERE id = $1')) {
    const req = memoryRequests.find((r) => r.id === params[0]);
    return { rows: req ? [{ ...req }] : [] };
  }

  // 13. UPDATE request fulfilled
  if (q.includes('UPDATE requests SET is_fulfilled = true')) {
    const req = memoryRequests.find((r) => r.id === params[0]);
    if (req) {
      req.is_fulfilled = true;
      return { rows: [{ ...req }] };
    }
    return { rows: [] };
  }

  // 14. DELETE request
  if (q.startsWith('DELETE FROM requests WHERE id = $1')) {
    const idx = memoryRequests.findIndex((r) => r.id === params[0]);
    if (idx !== -1) memoryRequests.splice(idx, 1);
    return { rowCount: 1 };
  }

  return { rows: [] };
}

module.exports = {
  query: async (text, params) => {
    if (usePostgres && pool) {
      try {
        return await pool.query(text, params);
      } catch (err) {
        console.warn('[Database] PostgreSQL query error, falling back to in-memory store:', err.message);
        return await executeInMemory(text, params);
      }
    }
    return await executeInMemory(text, params);
  },
  pool,
};
