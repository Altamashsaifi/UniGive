const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/auth');

// All request endpoints require JWT token per spec
router.use(authMiddleware);

router.get('/', requestController.getRequests);
router.post('/', requestController.createRequest);
router.patch('/:id/fulfill', requestController.fulfillRequest);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;
