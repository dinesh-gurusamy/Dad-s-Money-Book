import express from "express";
import asyncHandler from "express-async-handler";

// 🔑 IMPORTANT: Add .js to local imports
import { protect } from "../middleware/auth.js";
import Repayment from "../models/Repayment.js";
import BorrowedMoney from "../models/BorrowedMoney.js";
import Loan from "../models/Loan.js";

const router = express.Router();
// @desc    Add a repayment
// @route   POST /api/repayment
// @access  Private

// @desc    Get all borrowed and loan records (including paid)
// @route   GET /api/repayment/records
// @access  Private
// @desc    Get all borrowed and loan records with repayment history
// @route   GET /api/repayment/records
// @access  Private
router.get(
  "/records",
  protect,
  asyncHandler(async (req, res) => {
    try {
      // Get all BorrowedMoney records
      const borrowedRecords = await BorrowedMoney.find({ user: req.user._id })
        .select("personName amount repaidAmount status date")
        .sort({ date: -1 });

      // Get all Loan records
      const loanRecords = await Loan.find({ user: req.user._id })
        .select("provider amount repaidAmount status date")
        .sort({ date: -1 });

      // Get ALL repayments
      const repayments = await Repayment.find({ user: req.user._id }).sort({ date: -1 });

      // Helper to format date
      const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

      // Group repayments by (type + paidTo)
      const getRepaymentHistory = (type, name) => {
        return repayments
          .filter(r => r.repaymentType === type && r.paidTo === name)
          .map(r => ({
            date: formatDate(r.date),
            amount: r.amount,
            mode: r.mode,
            notes: r.notes || "-",
          }));
      };

      // Format Borrowed
      const formattedBorrowed = borrowedRecords.map(b => {
        const history = getRepaymentHistory("Borrowed", b.personName);
        const paid = history.reduce((sum, r) => sum + r.amount, 0);
        const remaining = b.amount - paid;

        return {
          name: b.personName,
          borrowedDate: formatDate(b.date),
          total: b.amount,
          paid,
          remaining,
          status: b.status,
          lastPaidDate: history.length ? history[0].date : "-",
          history, // Include full history
        };
      });

      // Format Loans
      const formattedLoans = loanRecords.map(l => {
        const history = getRepaymentHistory("Loan", l.provider);
        const paid = history.reduce((sum, r) => sum + r.amount, 0);
        const remaining = l.amount - paid;

        return {
          name: l.provider,
          borrowedDate: formatDate(l.date),
          total: l.amount,
          paid,
          remaining,
          status: l.status,
          lastPaidDate: history.length ? history[0].date : "-",
          history,
        };
      });

      res.json({ borrowed: formattedBorrowed, loans: formattedLoans });
    } catch (error) {
      console.error("Error in /records:", error);
      res.status(500).json({ message: "Server error" });
    }
  })
);

router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { date, repaymentType, paidTo, amount, mode, notes } = req.body;

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    // Find the record (Borrowed or Loan)
    let record;
    if (repaymentType === "Borrowed") {
      record = await BorrowedMoney.findOne({
        user: req.user._id,
        personName: paidTo,
        status: "Pending",
      });
    } else if (repaymentType === "Loan") {
      record = await Loan.findOne({
        user: req.user._id,
        provider: paidTo,
        status: "Pending",
      });
    }

    if (!record) {
      return res.status(404).json({
        message: `No active ${repaymentType.toLowerCase()} record found for ${paidTo}`,
      });
    }

    // Update repaid amount
    const newRepaidAmount = record.repaidAmount + amount;
    const totalAmount = record.amount;

    // Update status
    const status = newRepaidAmount >= totalAmount ? "Paid" : "Pending";

    // Update the record
    record.repaidAmount = newRepaidAmount;
    record.status = status;
    await record.save();

    // Create repayment entry
    const repayment = await Repayment.create({
      user: req.user._id,
      date,
      repaymentType,
      paidTo,
      amount,
      mode,
      notes,
    });

    res.status(201).json({
      repayment,
      updatedRecord: {
        type: repaymentType,
        name: paidTo,
        total: totalAmount,
        repaid: newRepaidAmount,
        status,
      },
    });
  })
);

// @desc    Get all repayments
// @route   GET /api/repayment
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const repayments = await Repayment.find({ user: req.user._id }).sort({ date: -1 });
    res.json(repayments);
  })
);

// @desc    Get pending borrowed & loans for repayment dropdown
// @route   GET /api/repayment/options
// @access  Private
router.get(
  "/options",
  protect,
  asyncHandler(async (req, res) => {
    const borrowed = await BorrowedMoney.find({
      user: req.user._id,
      status: "Pending",
    }).select("personName amount repaidAmount");

    const loans = await Loan.find({
      user: req.user._id,
      status: "Pending",
    }).select("provider amount repaidAmount");

    res.json({
      borrowed: borrowed.map(b => ({
        name: b.personName,
        total: b.amount,
        repaid: b.repaidAmount,
        balance: b.amount - b.repaidAmount,
      })),
      loans: loans.map(l => ({
        name: l.provider,
        total: l.amount,
        repaid: l.repaidAmount,
        balance: l.amount - l.repaidAmount,
      })),
    });
  })
);

export default router;