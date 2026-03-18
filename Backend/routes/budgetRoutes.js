const router = require('express').Router();
const { addBudget, getBudgets, deleteBudget } = require('../controllers/budget');
const { protect } = require('../middleware/authMiddleware');

router.post('/add-budget', protect, addBudget);
router.get('/get-budgets', protect, getBudgets);
router.delete('/delete-budget/:id', protect, deleteBudget);

module.exports = router;
