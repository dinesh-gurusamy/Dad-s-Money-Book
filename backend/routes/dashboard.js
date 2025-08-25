// routes/dashboard.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const asyncHandler = require("express-async-handler");

const Income = require("../models/Income");
const Expense = require("../models/Expense");
const BorrowedMoney = require("../models/BorrowedMoney");
const Loan = require("../models/Loan");
const Repayment = require("../models/Repayment");

// @desc    Get dashboard summary data
// @route   GET /api/dashboard
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [
      income,
      expenses,
      borrowed,
      loans,
      repayments,
    ] = await Promise.all([
      Income.find({ user: userId }),
      Expense.find({ user: userId }),
      BorrowedMoney.find({ user: userId }),
      Loan.find({ user: userId }),
      Repayment.find({ user: userId }),
    ]);

    // Calculations
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBorrowed = borrowed.reduce((sum, b) => sum + b.amount, 0);
    const totalRepaid = repayments.reduce((sum, r) => sum + r.amount, 0);
    const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);
    const loanOutstanding = totalLoans - totalRepaid;

    // Upcoming Payments (due in next 30 days)
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setDate(now.getDate() + 30);

    const upcoming = [];

    // Borrowed with dueDate
    borrowed.forEach(b => {
      if (b.dueDate && new Date(b.dueDate) >= now && new Date(b.dueDate) <= nextMonth) {
        upcoming.push({
          type: "Repayment",
          label: `Repayment to ${b.personName}`,
          dueDate: b.dueDate,
          amount: b.amount - (b.repaidAmount || 0),
        });
      }
    });

    // You can add Loan EMI logic here if needed

    // Sort by due date
    upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    res.json({
      income: totalIncome,
      expenses: totalExpenses,
      borrowed: totalBorrowed,
      repaid: totalRepaid,
      loanOutstanding,
      netBalance: totalIncome - totalExpenses,
      upcoming,
    });
  })
);

module.exports = router;