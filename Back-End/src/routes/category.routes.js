const { Router } = require('express');
const { getAll, create, update, remove } = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.use(protect);

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;    