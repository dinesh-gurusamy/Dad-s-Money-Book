import express from "express";
import asyncHandler from "express-async-handler";

// 🔑 IMPORTANT: Add .js to all local imports
import { protect } from "../middleware/auth.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import BorrowedMoney from "../models/BorrowedMoney.js";
import Loan from "../models/Loan.js";
import Repayment from "../models/Repayment.js";

const router = express.Router();

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [
      incomes,
      expenses,
      borrowed,
      loans,
      repayments,
    ] = await Promise.all([
      Income.find({ user: userId }).select("date source amount notes"),
      Expense.find({ user: userId }).select("date category amount paymentMethod notes"),
      BorrowedMoney.find({ user: userId }).select("date personName amount notes"),
      Loan.find({ user: userId }).select("date provider amount notes"),
      Repayment.find({ user: userId }).select("date repaymentType paidTo amount mode notes"),
    ]);

    // Format all into unified transaction list
    const transactions = [
      ...incomes.map(i => ({
        _id: i._id,
        date: i.date,
        type: "Income",
        provider: i.source,
        category: i.source,
        mode: "N/A",
        amount: i.amount,
        notes: i.notes,
        model: "Income",
      })),
      ...expenses.map(e => ({
        _id: e._id,
        date: e.date,
        type: "Expense",
        provider: e.category,
        category: e.category,
        mode: e.paymentMethod,
        amount: -e.amount,
        notes: e.notes,
        model: "Expense",
      })),
      ...borrowed.map(b => ({
        _id: b._id,
        date: b.date,
        type: "Borrowed",
        provider: b.personName,
        category: "Personal",
        mode: "N/A",
        amount: b.amount,
        notes: b.notes,
        model: "BorrowedMoney",
      })),
      ...loans.map(l => ({
        _id: l._id,
        date: l.date,
        type: "Loan",
        provider: l.provider,
        category: "Loan",
        mode: "N/A",
        amount: l.amount,
        notes: l.notes,
        model: "Loan",
      })),
      ...repayments.map(r => ({
        _id: r._id,
        date: r.date,
        type: "Repayment",
        provider: r.paidTo,
        category: r.repaymentType,
        mode: r.mode,
        amount: -r.amount,
        notes: r.notes,
        model: "Repayment",
      })),
    ];

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(transactions);
  })
);

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id/:model
// @access  Private
router.delete(
  "/:id/:model",
  protect,
  asyncHandler(async (req, res) => {
    const { id, model } = req.params;
    const userId = req.user._id;

    let Model;
    switch (model) {
      case "Income":
        Model = Income;
        break;
      case "Expense":
        Model = Expense;
        break;
      case "BorrowedMoney":
        Model = BorrowedMoney;
        break;
      case "Loan":
        Model = Loan;
        break;
      case "Repayment":
        Model = Repayment;
        break;
      default:
        return res.status(400).json({ message: "Invalid model" });
    }

    const record = await Model.findById(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    if (record.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Model.findByIdAndDelete(id);
    res.json({ message: "Transaction deleted" });
  })
);

export default router;