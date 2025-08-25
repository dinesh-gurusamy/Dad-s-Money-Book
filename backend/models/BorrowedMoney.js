// models/BorrowedMoney.js
const mongoose = require("mongoose");

const BorrowedMoneySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  personName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: Date,
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

module.exports = mongoose.model("BorrowedMoney", BorrowedMoneySchema);