// routes/borrowed.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
const BorrowedMoney = require("../models/BorrowedMoney");

// @desc    Add borrowed money
// @route   POST /api/borrowed
// @access  Private
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { date, personName, amount, dueDate, notes } = req.body;

    const borrowed = await BorrowedMoney.create({
      user: req.user._id,
      date,
      personName,
      amount,
      dueDate,
      notes,
    });

    res.status(201).json(borrowed);
  })
);

// @desc    Get all borrowed money for logged-in user
// @route   GET /api/borrowed
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const borrowed = await BorrowedMoney.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(borrowed);
  })
);

// @desc    Get single borrowed record
// @route   GET /api/borrowed/:id
// @access  Private
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const borrowed = await BorrowedMoney.findById(req.params.id);

    if (!borrowed) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (borrowed.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(borrowed);
  })
);

// @desc    Update borrowed money
// @route   PUT /api/borrowed/:id
// @access  Private
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const { date, personName, amount, dueDate, notes } = req.body;

    let borrowed = await BorrowedMoney.findById(req.params.id);

    if (!borrowed) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (borrowed.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    borrowed = await BorrowedMoney.findByIdAndUpdate(
      req.params.id,
      { date, personName, amount, dueDate, notes },
      { new: true, runValidators: true }
    );

    res.json(borrowed);
  })
);

// @desc    Delete borrowed money
// @route   DELETE /api/borrowed/:id
// @access  Private
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const borrowed = await BorrowedMoney.findById(req.params.id);

    if (!borrowed) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (borrowed.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await BorrowedMoney.findByIdAndDelete(req.params.id);
    res.json({ message: "Record removed" });
  })
);

module.exports = router;