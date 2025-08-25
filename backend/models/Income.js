// models/Income.js
const mongoose = require("mongoose"); // ✅ Must be here too

const IncomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  notes: String,
});

module.exports = mongoose.model("Income", IncomeSchema);