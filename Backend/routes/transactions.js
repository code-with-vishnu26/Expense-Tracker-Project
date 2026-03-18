const router = require("express").Router();
const {addIncome,getIncomes, deleteIncome, updateIncome} = require("../controllers/income");
const {addExpense, getExpenses, deleteExpense, updateExpense} = require("../controllers/expense");
const { exportCSV } = require("../controllers/export");
const { protect } = require("../middleware/authMiddleware");

router.post('/add-income', protect, addIncome)
    .get('/get-incomes', protect, getIncomes)
    .delete('/delete-income/:id', protect, deleteIncome)
    .put('/update-income/:id', protect, updateIncome)
    .post('/add-expense', protect, addExpense)
    .get('/get-expenses', protect, getExpenses)
    .delete('/delete-expense/:id', protect, deleteExpense)
    .put('/update-expense/:id', protect, updateExpense)
    .get('/export/csv', protect, exportCSV)

module.exports = router;