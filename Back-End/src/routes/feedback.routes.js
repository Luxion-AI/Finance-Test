const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { sendFeedback } = require('../controllers/feedback.controller');

router.post('/', protect, sendFeedback);

module.exports = router;