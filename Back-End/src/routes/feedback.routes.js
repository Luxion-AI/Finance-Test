const { Router } = require('express');
const { protect } = require('../middleware/auth.middleware');
const { sendFeedback } = require('../controllers/feedback.controller');

const router = Router();

router.use(protect);

router.post('/', sendFeedback);

module.exports = router;