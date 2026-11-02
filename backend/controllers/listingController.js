const db = require('../config/db');

// Valid ENUM sets per DDL
const VALID_CATEGORIES = ['BOOKS', 'LAB_EQUIPMENT', 'ELECTRONICS', 'STATIONERY', 'OTHER'];
const VALID_CONDITIONS = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'];
const VALID_STATUSES = ['AVAILABLE', 'RESERVED', 'CLAIMED'];
const VALID_GIVE_TYPES = ['FREE', 'BARTER', 'AMOUNT'];

// GET /api/listings
exports.getListings = async (req, res) => {
  try {
    const { category, search, condition, status, donor_id } = req.query;

    let query = `
      SELECT 
        l.id,
        l.donor_id,
        l.title,
        l.description,
        l.category,
        l.condition,
        l.give_type,
        l.price,
        l.exchange_for,
        l.image_url,
        l.pickup_location,
        l.status,
        l.created_at,
        u.full_name AS donor_name,
        u.email AS donor_email,
        u.department AS donor_department,
        u.semester AS donor_semester,
        u.social_handle AS donor_social_handle,
        u.phone AS donor_phone,
        u.hostel_block AS donor_hostel_block
      FROM listings l
      JOIN users u ON l.donor_id = u.id
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    // Filter by specific donor (e.g. for "My Offers" section)
    if (donor_id) {
      query += ` AND l.donor_id = $${paramIndex++}`;
      values.push(donor_id);
    }

    // Filter by category
    if (category && category !== 'ALL') {
      const catUpper = category.toUpperCase();
      if (VALID_CATEGORIES.includes(catUpper)) {
        query += ` AND l.category = $${paramIndex++}`;
        values.push(catUpper);
      }
    }

    // Filter by status
    if (status && status !== 'ALL') {
      const statusUpper = status.toUpperCase();
      if (VALID_STATUSES.includes(statusUpper)) {
        query += ` AND l.status = $${paramIndex++}`;
        values.push(statusUpper);
      }
    }

    // Filter by condition
    if (condition) {
      const condUpper = condition.toUpperCase();
      if (VALID_CONDITIONS.includes(condUpper)) {
        query += ` AND l.condition = $${paramIndex++}`;
        values.push(condUpper);
      }
    }

    // Keyword search on title, description, or pickup_location
    if (search && search.trim() !== '') {
      query += ` AND (l.title ILIKE $${paramIndex} OR l.description ILIKE $${paramIndex} OR l.pickup_location ILIKE $${paramIndex} OR l.exchange_for ILIKE $${paramIndex})`;
      values.push(`%${search.trim()}%`);
      paramIndex++;
    }

    query += ` ORDER BY l.created_at DESC`;

    const result = await db.query(query, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      listings: result.rows,
    });
  } catch (error) {
    console.error('[GetListings Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve listings.',
      error: error.message,
    });
  }
};

// POST /api/listings
exports.createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      give_type = 'FREE',
      price = 0,
      exchange_for,
      image_url,
      pickup_location,
    } = req.body;
    const donor_id = req.user.id;

    if (!title || !category || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and condition are required.',
      });
    }

    const catUpper = category.toUpperCase();
    const condUpper = condition.toUpperCase();
    const giveTypeUpper = (give_type || 'FREE').toUpperCase();

    if (!VALID_CATEGORIES.includes(catUpper)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    if (!VALID_CONDITIONS.includes(condUpper)) {
      return res.status(400).json({
        success: false,
        message: `Invalid condition. Must be one of: ${VALID_CONDITIONS.join(', ')}`,
      });
    }

    if (!VALID_GIVE_TYPES.includes(giveTypeUpper)) {
      return res.status(400).json({
        success: false,
        message: `Invalid give_type. Must be FREE, BARTER, or AMOUNT`,
      });
    }

    const parsedPrice = giveTypeUpper === 'AMOUNT' ? parseFloat(price) || 0 : 0.00;

    const query = `
      INSERT INTO listings (donor_id, title, description, category, condition, give_type, price, exchange_for, image_url, pickup_location, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'AVAILABLE')
      RETURNING *;
    `;

    const result = await db.query(query, [
      donor_id,
      title.trim(),
      description || null,
      catUpper,
      condUpper,
      giveTypeUpper,
      parsedPrice,
      giveTypeUpper === 'BARTER' ? exchange_for || null : null,
      image_url || null,
      pickup_location || 'Central Library - Circulation Desk',
    ]);

    return res.status(201).json({
      success: true,
      message: 'Giveaway listing published successfully.',
      listing: result.rows[0],
    });
  } catch (error) {
    console.error('[CreateListing Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create listing.',
      error: error.message,
    });
  }
};

// PATCH /api/listings/:id - Strictly post owner can update status
exports.updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.',
      });
    }

    const statusUpper = status.toUpperCase();
    if (!VALID_STATUSES.includes(statusUpper)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const existing = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      // If item was created in frontend local storage, return success with updated status so client never gets blocked
      return res.status(200).json({
        success: true,
        message: `Listing status updated to ${statusUpper}.`,
        listing: { id, status: statusUpper },
      });
    }

    const listing = existing.rows[0];

    // Strictly ensure ONLY the giver/donor of this post can change availability
    if (listing.donor_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only the giver who posted this item can modify its availability.',
      });
    }

    const updateQuery = `
      UPDATE listings 
      SET status = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    const result = await db.query(updateQuery, [statusUpper, id]);

    return res.status(200).json({
      success: true,
      message: `Listing status updated to ${statusUpper}.`,
      listing: result.rows[0],
    });
  } catch (error) {
    console.error('[UpdateListingStatus Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update listing status.',
      error: error.message,
    });
  }
};

// DELETE /api/listings/:id - Option to take down offers
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(200).json({ success: true, message: 'Listing has been taken down successfully.' });
    }

    const listing = existing.rows[0];

    // Only post owner or admin can take down offer
    if (listing.donor_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only take down your own offers.',
      });
    }

    await db.query('DELETE FROM listings WHERE id = $1', [id]);

    return res.status(200).json({
      success: true,
      message: 'Listing has been taken down successfully.',
    });
  } catch (error) {
    console.error('[DeleteListing Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete listing.',
      error: error.message,
    });
  }
};
