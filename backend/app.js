import express from "express";
import cors from "cors";
import morgan from "morgan"; 

//importing global error handler 
import globalErrorHandler from "./middlewares/errorHandler.js";

//importing routes 
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";     

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes); 
app.use("/api/expenses", expenseRoutes);
 
app.get("/", (req, res) => {
    res.send("Welcome to the Xpenz API");
});

app.use((err, req, res, next) => {
    const errorResponse = globalErrorHandler(err);
    res.status(500).json(errorResponse);
});

export default app;