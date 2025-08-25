// models/Repayment.js
const mongoose = require("mongoose"); // ✅ Add this

const RepaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  repaymentType: {
    type: String,
    enum: ["Borrowed", "Loan"],
    required: true,
  },
  paidTo: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  notes: String,
  repaidAmount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ["Pending", "Paid"], 
    default: "Pending" 
  },
});

module.exports = mongoose.model("Repayment", RepaymentSchema);