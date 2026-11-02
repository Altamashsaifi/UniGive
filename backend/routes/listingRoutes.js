const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/auth');

// All listings endpoints require JWT token per spec
router.use(authMiddleware);

router.get('/', listingController.getListings);
router.post('/', listingController.createListing);
router.patch('/:id', listingController.updateListingStatus);
router.delete('/:id', listingController.deleteListing);

module.exports = router;
