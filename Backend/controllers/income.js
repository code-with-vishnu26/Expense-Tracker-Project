const IncomeSchema = require("../models/incomeModel")

exports.addIncome=async(req, res) => {
    const {title,amount,category,description,date,isRecurring,recurringInterval} = req.body
    const income = IncomeSchema({
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
        await income.save()
        res.status(200).json({message:"Income added successfully"})
    }catch(e){
        res.status(500).json({message:"Server Error"})
    }
}

exports.getIncomes=async(req, res) => {
    try{
        const incomes = await IncomeSchema.find({ user: req.user._id }).sort({createdAt:-1})
        res.status(200).json(incomes)
    }catch(e){
        res.status(500).json({message:"Server Error"})
    }
}

exports.deleteIncome=async(req, res) => {
    const {id} = req.params
    try {
        const income = await IncomeSchema.findById(id)
        if (!income) {
            return res.status(404).json({message:"Income not found"})
        }
        if (income.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message:"Not authorized"})
        }
        await IncomeSchema.findByIdAndDelete(id)
        res.status(200).json({message:"Income deleted successfully"})
    } catch(e) {
        res.status(500).json({message:"Server Error"})
    }
}

exports.updateIncome=async(req, res) => {
    const {id} = req.params
    try {
        const income = await IncomeSchema.findById(id)
        if (!income) {
            return res.status(404).json({message:"Income not found"})
        }
        if (income.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message:"Not authorized"})
        }
        const { title, amount, category, description, date, isRecurring, recurringInterval } = req.body
        if (title !== undefined) income.title = title
        if (amount !== undefined) income.amount = amount
        if (category !== undefined) income.category = category
        if (description !== undefined) income.description = description
        if (date !== undefined) income.date = date
        if (isRecurring !== undefined) income.isRecurring = isRecurring
        if (recurringInterval !== undefined) income.recurringInterval = recurringInterval
        const updated = await income.save()
        res.status(200).json(updated)
    } catch(e) {
        res.status(500).json({message:"Server Error"})
    }
}