const IncomeSchema = require('../models/incomeModel');
const ExpenseSchema = require('../models/expenseModel');

exports.exportCSV = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find({ user: req.user._id }).sort({ date: -1 });
        const expenses = await ExpenseSchema.find({ user: req.user._id }).sort({ date: -1 });

        let csv = 'Type,Title,Amount,Category,Description,Date\n';

        incomes.forEach((item) => {
            csv += `Income,"${item.title}",${item.amount},"${item.category}","${item.description}",${new Date(item.date).toLocaleDateString()}\n`;
        });

        expenses.forEach((item) => {
            csv += `Expense,"${item.title}",${item.amount},"${item.category}","${item.description}",${new Date(item.date).toLocaleDateString()}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
