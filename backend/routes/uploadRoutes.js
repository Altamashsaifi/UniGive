const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/auth');

// In-memory buffer for multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are permitted.'), false);
    }
  },
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      // Fallback: return base64 data URI for local offline development without needing external Cloudinary API keys
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      return res.status(200).json({
        success: true,
        message: 'Image processed (Local dev base64 fallback).',
        url: base64Data,
      });
    }

    // Upload to Cloudinary stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'unigive_listings' },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]', error);
          return res.status(500).json({ success: false, message: 'Cloudinary upload failed.', error: error.message });
        }
        return res.status(200).json({
          success: true,
          message: 'Image uploaded successfully.',
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('[Upload Error]', error);
    return res.status(500).json({ success: false, message: 'Image upload error.', error: error.message });
  }
});

module.exports = router;
