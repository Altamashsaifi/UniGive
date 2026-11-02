const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Institutional domain regex: must end in .ac.in or match .edu
const CAMPUS_EMAIL_REGEX = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.)?(ac\.in|edu(\.[a-zA-Z]{2,})?)$/i;

const isCampusEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  return CAMPUS_EMAIL_REGEX.test(trimmed) || trimmed.includes('.ac.in') || trimmed.includes('.edu');
};

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'unigive_super_secure_jwt_secret_change_me_in_production';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, department, semester, social_handle, phone, hostel_block, bio } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'full_name, email, and password are required fields.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Enforce campus institutional domain verification
    if (!isCampusEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Registration restricted: Only official university domains (@college.ac.in or .edu) are permitted.',
      });
    }

    // Check existing email
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this institutional email already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const insertQuery = `
      INSERT INTO users (full_name, email, password_hash, department, semester, social_handle, phone, hostel_block, bio, role, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'STUDENT', true)
      RETURNING id, full_name, email, department, semester, social_handle, phone, hostel_block, bio, role, is_verified, created_at;
    `;
    const result = await db.query(insertQuery, [
      full_name.trim(),
      cleanEmail,
      password_hash,
      department || null,
      semester ? parseInt(semester, 10) : null,
      social_handle || null,
      phone || null,
      hostel_block || null,
      bio || null,
    ]);

    const newUser = result.rows[0];
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully with verified campus credentials.',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('[Register Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
      error: error.message,
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const result = await db.query(
      `SELECT id, full_name, email, password_hash, department, semester, social_handle, phone, hostel_block, bio, role, is_verified, created_at 
       FROM users WHERE email = $1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.',
      });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.',
      });
    }

    delete user.password_hash;
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user,
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
      error: error.message,
    });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, full_name, email, department, semester, social_handle, phone, hostel_block, bio, role, is_verified, created_at 
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error('[GetMe Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

// PUT /api/auth/profile - Personalization update
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, department, semester, social_handle, phone, hostel_block, bio } = req.body;
    const userId = req.user.id;

    const updateQuery = `
      UPDATE users
      SET 
        full_name = COALESCE($1, full_name),
        department = COALESCE($2, department),
        semester = COALESCE($3, semester),
        social_handle = COALESCE($4, social_handle),
        phone = COALESCE($5, phone),
        hostel_block = COALESCE($6, hostel_block),
        bio = COALESCE($7, bio)
      WHERE id = $8
      RETURNING id, full_name, email, department, semester, social_handle, phone, hostel_block, bio, role, is_verified, created_at;
    `;

    const result = await db.query(updateQuery, [
      full_name ? full_name.trim() : null,
      department ? department.trim() : null,
      semester ? parseInt(semester, 10) : null,
      social_handle ? social_handle.trim() : null,
      phone ? phone.trim() : null,
      hostel_block ? hostel_block.trim() : null,
      bio ? bio.trim() : null,
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('[UpdateProfile Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message,
    });
  }
};
