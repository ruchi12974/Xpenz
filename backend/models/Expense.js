import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    // Using ObjectId creates a formal link to the User collection
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true // Removes accidental whitespace
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"]
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health','studies', 'Others'],
        default: 'Others'
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        default: Date.now
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [200, "Notes cannot exceed 200 characters"]
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt
});

// PascalCase naming for models is the standard
const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;