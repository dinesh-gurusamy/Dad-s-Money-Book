import express from "express";
import asyncHandler from "express-async-handler";

// 🔑 IMPORTANT: Add .js to your local file imports
import { protect } from "../middleware/auth.js";
import Income from "../models/Income.js";

const router = express.Router();
// @desc    Add income
// @route   POST /api/income
// @access  Private
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { date, source, amount, notes } = req.body;

    const income = await Income.create({
      user: req.user._id,
      date,
      source,
      amount,
      notes,
    });

    res.status(201).json(income);
  })
);

// @desc    Get all income for logged-in user
// @route   GET /api/income
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const income = await Income.find({ user: req.user._id }).sort({ date: -1 });
    res.json(income);
  })
);

export default router;