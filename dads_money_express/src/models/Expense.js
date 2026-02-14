// models/Expense.js
import mongoose from "mongoose"; // ✅ Add this

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  notes: String,
});

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;