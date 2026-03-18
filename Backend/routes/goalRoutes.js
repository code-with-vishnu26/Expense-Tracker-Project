const router = require('express').Router();
const { addGoal, getGoals, updateGoal, deleteGoal } = require('../controllers/goal');
const { protect } = require('../middleware/authMiddleware');

router.post('/add-goal', protect, addGoal);
router.get('/get-goals', protect, getGoals);
router.put('/update-goal/:id', protect, updateGoal);
router.delete('/delete-goal/:id', protect, deleteGoal);

module.exports = router;
