import React, { useState, useEffect } from "react";
import API from "../../config/api";
import { useNavigate } from "react-router-dom";

export default function Repayment() {
  const [formData, setFormData] = useState({
    date: "",
    repaymentType: "",
    relatedId: "", // 🔑 New: used to identify specific loan/borrowed record
    paidTo: "",    // Name for display/legacy tracking
    amount: "",
    mode: "",
    notes: "",
  });

  const [options, setOptions] = useState({ borrowed: [], loans: [] });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await API.get("/repayment/options");
        setOptions(res.data);
      } catch {
        console.error("Failed to load repayment options");
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "relatedId") {
      // 🔑 Find the matching name for the selected ID
      const selectedOption = filteredOptions.find((opt) => (opt.id === value || opt._id === value));
      setFormData((prev) => ({
        ...prev,
        relatedId: value,
        paidTo: selectedOption ? selectedOption.name : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "repaymentType") {
      setFormData((prev) => ({ ...prev, relatedId: "", paidTo: "", amount: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔑 Ensure relatedId is validated instead of just paidTo
    if (!formData.date || !formData.repaymentType || !formData.relatedId || !formData.amount || !formData.mode) {
      alert("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      await API.post("/repayment", formData);

      setFormData({ date: "", repaymentType: "", relatedId: "", paidTo: "", amount: "", mode: "", notes: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(
        error.response?.data?.message ||
          "Failed to add repayment. Check if the person/loan exists and is pending."
      );
    }
  };

  const filteredOptions =
    formData.repaymentType === "Borrowed" ? options.borrowed : options.loans;

  return (
    <div className="flex flex-col p-4 sm:p-6 md:p-10 min-h-screen">
      <h1 className="text-2xl sm:text-3xl text-blue-800 text-center mb-6 sm:mb-8">
        Record Repayment
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

          {/* Repayment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 mb-6 sm:mb-10">
            <label className="block text-base sm:text-lg font-thin">
              Repayment Type
            </label>
            <select
              name="repaymentType"
              value={formData.repaymentType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="Borrowed">Borrowed Money</option>
              <option value="Loan">Loan</option>
            </select>
          </div>

          {/* Paid To (Linked by ID) */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 mb-6 sm:mb-10">
            <label className="block text-base sm:text-lg font-thin">Select Record</label>
            <select
              name="relatedId"
              value={formData.relatedId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!formData.repaymentType}
            >
              <option value="">
                Select {formData.repaymentType || "Record"}
              </option>
              {filteredOptions.map((opt) => (
                <option key={opt.id || opt._id} value={opt.id || opt._id}>
                  {opt.name} (₹{opt.balance} due)
                </option>
              ))}
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

          {/* Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 mb-6 sm:mb-10">
            <label className="block text-base sm:text-lg font-thin">Mode</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Mode</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 mb-6 sm:mb-10">
            <label className="block text-base sm:text-lg font-thin">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional notes"
              rows="1"
              className="w-full px-3 py-2 border border-x-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/money-out")}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              ← Back to Money Out
            </button>

            {showSuccess && (
              <div className="w-full sm:flex-1 px-4 py-2 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm animate-fade-in text-center">
                ✅ Repayment recorded!
              </div>
            )}

            <button
              type="submit"
              className={`w-full sm:w-1/5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Repayment"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
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