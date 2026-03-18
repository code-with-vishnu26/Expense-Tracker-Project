const Budget = require('../models/budgetModel');

exports.addBudget = async (req, res) => {
    const { category, amount, month, year } = req.body;
    try {
        if (!category || !amount || !month || !year) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        // Upsert: update if exists, create if not
        const budget = await Budget.findOneAndUpdate(
            { user: req.user._id, category, month, year },
            { amount },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const { month, year } = req.query;
        const filter = { user: req.user._id };
        if (month) filter.month = parseInt(month);
        if (year) filter.year = parseInt(year);

        const budgets = await Budget.find(filter).sort({ category: 1 });
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteBudget = async (req, res) => {
    const { id } = req.params;
    try {
        const budget = await Budget.findById(id);
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await Budget.findByIdAndDelete(id);
        res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
