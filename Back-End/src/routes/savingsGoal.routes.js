const { Router } = require('express');
const { getAll, create, update, remove, addFunds } = require('../controllers/savingsGoal.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.get('/', protect, getAll);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);
router.put('/:id/add-funds', protect, addFunds);

module.exports = router;
