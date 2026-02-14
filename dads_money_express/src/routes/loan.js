import express from "express";
import asyncHandler from "express-async-handler";

// 🔑 IMPORTANT: Add .js to local imports
import { protect } from "../middleware/auth.js";
import Loan from "../models/Loan.js";

const router = express.Router();

// @desc    Add a loan
// @route   POST /api/loan
// @access  Private
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { date, provider, amount, emi, tenure, notes } = req.body;

    const loan = await Loan.create({
      user: req.user._id,
      date,
      provider,
      amount,
      emi,
      tenure,
      notes,
    });

    res.status(201).json(loan);
  })
);

// @desc    Get all loans for user
// @route   GET /api/loan
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const loans = await Loan.find({ user: req.user._id }).sort({ date: -1 });
    res.json(loans);
  })
);

// @desc    Get single loan
// @route   GET /api/loan/:id
// @access  Private
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(loan);
  })
);

// @desc    Update loan
// @route   PUT /api/loan/:id
// @access  Private
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const { date, provider, amount, emi, tenure, notes } = req.body;

    let loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { date, provider, amount, emi, tenure, notes },
      { new: true, runValidators: true }
    );

    res.json(loan);
  })
);

// @desc    Delete loan
// @route   DELETE /api/loan/:id
// @access  Private
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Loan.findByIdAndDelete(req.params.id);
    res.json({ message: "Loan deleted" });
  })
);

export default router;