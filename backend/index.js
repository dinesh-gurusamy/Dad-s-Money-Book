// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/income", require("./routes/income"));
app.use("/api/borrowed", require("./routes/borrowed"));
app.use("/api/loan", require("./routes/loan"));
app.use("/api/expense", require("./routes/expense"));
app.use("/api/repayment", require("./routes/repayment"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/transactions", require("./routes/transaction"));


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB connection error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to Dad's Money Book Backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});