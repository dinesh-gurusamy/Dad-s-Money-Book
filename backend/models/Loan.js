// models/Loan.js
const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  emi: {
    type: Number,
    required: true,
  },
  tenure: {
    type: String,
    required: true,
  },
  notes: String,
  // ✅ New fields
  repaidAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Loan", LoanSchema);