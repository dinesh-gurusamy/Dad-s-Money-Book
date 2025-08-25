// routes/expense.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
const Expense = require("../models/Expense");

// @desc    Add an expense
// @route   POST /api/expense
// @access  Private
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { date, category, amount, paymentMethod, notes } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      date,
      category,
      amount,
      paymentMethod,
      notes,
    });

    res.status(201).json(expense);
  })
);

// @desc    Get all expenses
// @route   GET /api/expense
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(expenses);
  })
);

// @desc    Get single expense
// @route   GET /api/expense/:id
// @access  Private
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(expense);
  })
);

// @desc    Update expense
// @route   PUT /api/expense/:id
// @access  Private
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const { date, category, amount, paymentMethod, notes } = req.body;

    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { date, category, amount, paymentMethod, notes },
      { new: true, runValidators: true }
    );

    res.json(expense);
  })
);

// @desc    Delete expense
// @route   DELETE /api/expense/:id
// @access  Private
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  })
);

module.exports = router;