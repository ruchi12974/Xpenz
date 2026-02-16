import Expense from "../models/Expense.js";
import { expenseSchema } from "../validations/expenseValidation.js";

// 1. Create Expense
export const createExpense = async (req, res) => {
    try {
        const { error } = expenseSchema.validate(req.body);
        if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

        const { title, amount, category, date, notes } = req.body;

        const newExpense = new Expense({
            userId: req.user.id, // SECURE: Take ID from token, not body
            title,
            amount,
            category,
            date,
            notes
        });

        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Get a Single Expense by ID
export const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the expense AND verify it belongs to the authenticated user
        const expense = await Expense.findOne({ _id: id, userId: req.user.id });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        res.status(200).json(expense);
    } catch (error) {
        // If the ID is not a valid MongoDB ObjectId, it will throw an error
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid Expense ID format" });
        }
        res.status(500).json({ message: error.message });
    }
};


export const getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate, search, page = 1, limit = 10 } = req.query;
        
        // 1. Build Query
        let query = { userId: req.user.id };
        if (category) query.category = category;
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // 2. Pagination Logic
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const expenses = await Expense.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalTransactions = await Expense.countDocuments(query);

        // 3. Response aligned with Frontend
        res.status(200).json({
            expenses,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalTransactions / limit),
            totalTransactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update Expense
export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findOne({ _id: id, userId: req.user.id });
        if (!expense) return res.status(404).json({ message: "Expense not found or unauthorized" });

        const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Updated successfully", updatedExpense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!expense) return res.status(404).json({ message: "Expense not found or unauthorized" });
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};