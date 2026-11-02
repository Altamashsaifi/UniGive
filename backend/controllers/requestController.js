const db = require('../config/db');

const VALID_CATEGORIES = ['BOOKS', 'LAB_EQUIPMENT', 'ELECTRONICS', 'STATIONERY', 'OTHER'];

// GET /api/requests
exports.getRequests = async (req, res) => {
  try {
    const { category, search, fulfilled, seeker_id } = req.query;

    let query = `
      SELECT 
        r.id,
        r.seeker_id,
        r.title,
        r.description,
        r.category,
        r.is_fulfilled,
        r.created_at,
        u.full_name AS seeker_name,
        u.email AS seeker_email,
        u.department AS seeker_department,
        u.semester AS seeker_semester,
        u.social_handle AS seeker_social_handle,
        u.phone AS seeker_phone,
        u.hostel_block AS seeker_hostel_block
      FROM requests r
      JOIN users u ON r.seeker_id = u.id
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    // Filter by specific seeker (e.g. for "My Requests" section)
    if (seeker_id) {
      query += ` AND r.seeker_id = $${paramIndex++}`;
      values.push(seeker_id);
    }

    if (fulfilled !== undefined) {
      query += ` AND r.is_fulfilled = $${paramIndex++}`;
      values.push(fulfilled === 'true');
    }

    if (category && category !== 'ALL') {
      const catUpper = category.toUpperCase();
      if (VALID_CATEGORIES.includes(catUpper)) {
        query += ` AND r.category = $${paramIndex++}`;
        values.push(catUpper);
      }
    }

    if (search && search.trim() !== '') {
      query += ` AND (r.title ILIKE $${paramIndex} OR r.description ILIKE $${paramIndex})`;
      values.push(`%${search.trim()}%`);
      paramIndex++;
    }

    query += ` ORDER BY r.created_at DESC`;

    const result = await db.query(query, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      requests: result.rows,
    });
  } catch (error) {
    console.error('[GetRequests Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve seeker requests.',
      error: error.message,
    });
  }
};

// POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const seeker_id = req.user.id;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required.',
      });
    }

    const catUpper = category.toUpperCase();
    if (!VALID_CATEGORIES.includes(catUpper)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    const query = `
      INSERT INTO requests (seeker_id, title, description, category, is_fulfilled)
      VALUES ($1, $2, $3, $4, false)
      RETURNING *;
    `;

    const result = await db.query(query, [
      seeker_id,
      title.trim(),
      description || null,
      catUpper,
    ]);

    return res.status(201).json({
      success: true,
      message: 'Seeker request published successfully to the campus wishlist feed.',
      request: result.rows[0],
    });
  } catch (error) {
    console.error('[CreateRequest Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create seeker request.',
      error: error.message,
    });
  }
};

// PATCH /api/requests/:id/fulfill
exports.fulfillRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.query('SELECT * FROM requests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(200).json({ success: true, message: 'Request taken down successfully.' });
    }

    const reqItem = existing.rows[0];
    if (reqItem.seeker_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this request.' });
    }

    const result = await db.query(
      `UPDATE requests SET is_fulfilled = true WHERE id = $1 RETURNING *`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Request marked as fulfilled.',
      request: result.rows[0],
    });
  } catch (error) {
    console.error('[FulfillRequest Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fulfill request.',
      error: error.message,
    });
  }
};

// DELETE /api/requests/:id - Take down request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.query('SELECT * FROM requests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(200).json({ success: true, message: 'Request taken down successfully.' });
    }

    const reqItem = existing.rows[0];
    if (reqItem.seeker_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only take down your own requests.',
      });
    }

    await db.query('DELETE FROM requests WHERE id = $1', [id]);

    return res.status(200).json({
      success: true,
      message: 'Request taken down successfully.',
    });
  } catch (error) {
    console.error('[DeleteRequest Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to take down request.',
      error: error.message,
    });
  }
};
