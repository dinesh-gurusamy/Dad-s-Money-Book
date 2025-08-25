// src/pages/MoneyOut/Expense.js
import React, { useState } from "react";
import API from "../../config/api"; // ✅ Use centralized API instance
import { useNavigate } from "react-router-dom";

export default function Expense() {
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
    paymentMethod: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.date || !formData.category || !formData.amount || !formData.paymentMethod) {
      alert("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      await API.post("/expense", formData);

      setFormData({ date: "", category: "", amount: "", paymentMethod: "", notes: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Failed to add expense. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 md:p-10 min-h-screen">
      <h1 className="text-2xl sm:text-3xl text-blue-800 text-center mb-6 sm:mb-8">
        Add Expense
      </h1>

      <div className="flex items-center justify-center mb-10 flex-1">
        <form className="w-full max-w-4xl p-4 sm:p-6" onSubmit={handleSubmit}>
          {/* Date */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 mb-6 sm:mb-10">
            <label className="block text-base sm:text-lg font-thin">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 mb-6 sm:mb-10">
            <label className="block text-base sm:text-lg font-thin">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Medical">Medical</option>
              <option value="Education">Education</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 mb-6 sm:mb-10">
            <label className="block text-base sm:text-lg font-thin">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="₹0.00"
              step="0.01"
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 mb-6 sm:mb-10">
            <label className="block text-base sm:text-lg font-thin">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Method</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 mb-6 sm:mb-10">
            <label className="block text-base sm:text-lg font-thin">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional notes about this expense"
              rows="2"
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Buttons & Success Toast */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate("/money-out")}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              ← Back to Money Out
            </button>

            {/* Success Toast */}
            {showSuccess && (
              <div className="w-full sm:flex-1 px-4 py-2 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm animate-fade-in text-center">
                ✅ Expense added successfully!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full sm:w-1/5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>

      {/* Fade-in Animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
