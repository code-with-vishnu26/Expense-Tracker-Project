const ExpenseSchema = require("../models/expenseModel")

exports.addExpense=async(req, res) => {
    const {title,amount,category,description,date,isRecurring,recurringInterval} = req.body
    const expense = ExpenseSchema({
        title,
        amount,
        category,
        description,
        date,
        isRecurring: isRecurring || false,
        recurringInterval: recurringInterval || 'monthly',
        user: req.user._id
    })
    try{
        if(!title||!description||!date||!category){
            return res.status(400).json({message:"All fields required!"})
        }
        if(amount<=0 ||!amount === 'number'){
            return res.status(400).json({message:"Amount must be a positive integer!"})
        }
        await expense.save()
        res.status(200).json({message:"Expense added successfully"})
    }catch(e){
        res.status(500).json({message:"Server Error"})
    }
}

exports.getExpenses=async(req, res) => {
    try{
        const expenses = await ExpenseSchema.find({ user: req.user._id }).sort({createdAt:-1})
        res.status(200).json(expenses)
    }catch(e){
        res.status(500).json({message:"Server Error"})
    }
}

exports.deleteExpense=async(req, res) => {
    const {id} = req.params
    try {
        const expense = await ExpenseSchema.findById(id)
        if (!expense) {
            return res.status(404).json({message:"Expense not found"})
        }
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message:"Not authorized"})
        }
        await ExpenseSchema.findByIdAndDelete(id)
        res.status(200).json({message:"Expense deleted successfully"})
    } catch(e) {
        res.status(500).json({message:"Server Error"})
    }
}

exports.updateExpense=async(req, res) => {
    const {id} = req.params
    try {
        const expense = await ExpenseSchema.findById(id)
        if (!expense) {
            return res.status(404).json({message:"Expense not found"})
        }
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message:"Not authorized"})
        }
        const { title, amount, category, description, date, isRecurring, recurringInterval } = req.body
        if (title !== undefined) expense.title = title
        if (amount !== undefined) expense.amount = amount
        if (category !== undefined) expense.category = category
        if (description !== undefined) expense.description = description
        if (date !== undefined) expense.date = date
        if (isRecurring !== undefined) expense.isRecurring = isRecurring
        if (recurringInterval !== undefined) expense.recurringInterval = recurringInterval
        const updated = await expense.save()
        res.status(200).json(updated)
    } catch(e) {
        res.status(500).json({message:"Server Error"})
    }
}