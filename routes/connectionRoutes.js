const express = require('express');
const router = express.Router();
const { sendConnectionRequest, getConnectionRequests, respondToConnectionRequest } = require('../controllers/connectionController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Send a connection request
router.post('/', sendConnectionRequest);

// Get all connection requests for the current user
router.get('/', getConnectionRequests);

// Accept or reject a connection request
router.put('/:id', respondToConnectionRequest);

module.exports = router;
