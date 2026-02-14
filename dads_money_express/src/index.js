import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import incomeRoutes from './routes/income.js';
import borrowedRoutes from './routes/borrowed.js';
import loanRoutes from './routes/loan.js';
import expenseRoutes from './routes/expense.js';
import repaymentRoutes from './routes/repayment.js';
import dashboardRoutes from './routes/dashboard.js';
import transactionRoutes from './routes/transaction.js';

const app = express();

// Middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://dad-s-money-book.vercel.app", 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/borrowed", borrowedRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/repayment", repaymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to Dad's Money Book Backend! 🚀");
});

/* MongoDB – serverless safe connection */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI missing");
    return;
  }

  cached.promise = mongoose.connect(process.env.MONGO_URI);
  cached.conn = await cached.promise;
  console.log("✅ MongoDB connected");
  return cached.conn;
}

// Invoke connection
connectDB().catch(err => console.log("DB connection error:", err));

// 🔑 REQUIRED FOR VERCEL: Export the app
export default app;