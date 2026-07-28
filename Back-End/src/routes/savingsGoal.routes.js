const { Router } = require('express');
const { getAll, create, update, remove, addFunds } = require('../controllers/savingsGoal.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.use(protect);

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.put('/:id/add-funds', addFunds);

module.exports = router;
