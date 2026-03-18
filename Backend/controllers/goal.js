const Goal = require('../models/goalModel');

exports.addGoal = async (req, res) => {
    const { title, targetAmount, deadline, icon } = req.body;
    try {
        if (!title || !targetAmount) {
            return res.status(400).json({ message: 'Title and target amount are required' });
        }
        if (targetAmount <= 0) {
            return res.status(400).json({ message: 'Target amount must be a positive number' });
        }

        const goal = await Goal.create({
            title,
            targetAmount,
            deadline: deadline || null,
            icon: icon || '🎯',
            user: req.user._id
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateGoal = async (req, res) => {
    const { id } = req.params;
    try {
        const goal = await Goal.findById(id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { title, targetAmount, currentAmount, deadline, icon } = req.body;
        if (title !== undefined) goal.title = title;
        if (targetAmount !== undefined) goal.targetAmount = targetAmount;
        if (currentAmount !== undefined) goal.currentAmount = currentAmount;
        if (deadline !== undefined) goal.deadline = deadline;
        if (icon !== undefined) goal.icon = icon;

        const updatedGoal = await goal.save();
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteGoal = async (req, res) => {
    const { id } = req.params;
    try {
        const goal = await Goal.findById(id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await Goal.findByIdAndDelete(id);
        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
