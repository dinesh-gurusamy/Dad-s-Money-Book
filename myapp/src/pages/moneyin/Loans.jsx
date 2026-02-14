// src/pages/MoneyIn/Loans.js
import React, { useState } from "react";
import API from "../../config/api";
import { useNavigate } from "react-router-dom";

export default function AddLoan() {
  const [formData, setFormData] = useState({
    date: "",
    provider: "",
    amount: "",
    emi: "",
    tenure: "",
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

    // Validation
    if (
      !formData.date ||
      !formData.provider ||
      !formData.amount ||
      !formData.emi ||
      !formData.tenure
    ) {
      alert("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Get token from localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`, // JWT auth
        },
      };

      // Send to backend
      await API.post("/loan", formData, config);

      // Success: reset form, show notification
      setFormData({
        date: "",
        provider: "",
        amount: "",
        emi: "",
        tenure: "",
        notes: "",
      });
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
          error.response?.data?.message || "Failed to add loan. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex flex-col p-10 min-h-screen max-w-screen-lg mx-auto">
      <h1 className="text-3xl text-blue-800 text-center mb-8">Add Loan (Finance)</h1>

      <div className="flex items-center justify-center mb-10 flex-1 px-4 sm:px-0 w-full">
        <form className="w-full max-w-[700px] p-6" onSubmit={handleSubmit}>
          {/* Date */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Loan Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin mb-1">Loan Provider</label>
            <select
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Provider</option>
              <option value="IDFC">IDFC</option>
              <option value="Muthoot">Muthoot Finance</option>
              <option value="Annapoorna">Annapoorna</option>
              <option value="Tata_Capital">Tata Capital</option>
              <option value="mill_kuthagai">Mill Thottam Kithagai</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Loan Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin mb-1">Loan Amount</label>
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

          {/* EMI Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin mb-1">EMI Amount</label>
            <input
              type="number"
              name="emi"
              value={formData.emi}
              onChange={handleChange}
              placeholder="₹0.00"
              step="0.01"
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Tenure */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin mb-1">Tenure</label>
            <input
              type="text"
              name="tenure"
              value={formData.tenure}
              onChange={handleChange}
              placeholder="e.g., 60 months or 5 years"
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] mb-10 gap-y-2 sm:gap-y-0 sm:items-center">
            <label className="block text-lg font-thin mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional notes about this loan"
              rows="1"
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
              <div className="px-4 py-2 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm animate-fade-in flex-1 mx-0 sm:mx-4 text-center mb-4 sm:mb-0 w-full sm:w-auto">
                ✅ Loan added successfully!
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
              {loading ? "Saving..." : "Add Loan"}
            </button>
          </div>
        </form>
      </div>

      {/* Fade-in Animation for Toast */}
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