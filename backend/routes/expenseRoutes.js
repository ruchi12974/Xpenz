import express from "express";
import { createExpense, getExpenses,getExpenseById, updateExpense, deleteExpense } from "../controllers/expenseController.js"; 
import authenticationMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(authenticationMiddleware);

router.post("/", createExpense); 

router.get("/detail/:id", authenticationMiddleware, getExpenseById);

// GET /api/expenses?page=1&limit=10&category=Food
router.get("/", getExpenses); 

router.put("/:id", updateExpense); 
router.delete("/:id", deleteExpense); 

export default router;