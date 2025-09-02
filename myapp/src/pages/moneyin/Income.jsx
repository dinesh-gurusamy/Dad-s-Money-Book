// src/pages/MoneyIn/Income.js
import React, { useState } from "react";
import API from "../../config/api";
import { useNavigate } from "react-router-dom";

export default function Income() {
  const [formData, setFormData] = useState({
    date: "",
    source: "",
    amount: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // For popup notification

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    if (!formData.date || !formData.source || !formData.amount) {
      alert("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await API.post("/income", formData, config);

      // ✅ Reset form
      setFormData({ date: "", source: "", amount: "", notes: "" });

      // ✅ Show success popup
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3s

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        alert(
          error.response?.data?.message || "Failed to add income. Try again."
        );
      }
    }
  };

  return (
    <div className="flex flex-col p-6 sm:p-10 min-h-screen max-w-screen-lg mx-auto">
      <h1 className="text-3xl text-blue-800 text-center mb-8">Add Income</h1>

      <div className="flex items-center justify-center px-4 sm:px-0">
        <form className="w-full max-w-[700px]" onSubmit={handleSubmit}>
          {/* Date */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-8 sm:mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Source */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-8 sm:mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin">Source</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Source</option>
              <option value="salary">Salary</option>
              <option value="gift">Gift</option>
              <option value="refund">Refund</option>
              <option value="investment">Investment</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-8 sm:mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin">Amount</label>
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

          {/* Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-8 sm:mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Write your message"
              rows="2"
              className="w-full px-3 py-2 border border-x-blue-800 focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          {/* Buttons & Success Toast */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate("/money-in")}
              className="mb-4 sm:mb-0 flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition w-full sm:w-auto justify-center"
            >
              ← Back to Money In
            </button>

            {/* Success Toast */}
            {showSuccess && (
              <div className="mb-4 sm:mb-0 px-6 py-2 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm text-center animate-fade-in w-full sm:w-auto">
                ✅ Income added successfully!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full sm:w-1/4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Income"}
            </button>
          </div>
        </form>
      </div>

      {/* Optional: Add fade-in animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
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