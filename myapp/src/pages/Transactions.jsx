// src/pages/Transactions.js
import React, { useState, useEffect } from "react";
import API from "../config/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //const navigate = useNavigate();

  const [filters, setFilters] = useState({
    types: [],
    categories: [],
    providers: [],
    modes: [],
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const toggleFilter = (field, value) => {
    setFilters((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      };
    });
  };

  const applyDateFilter = (transactionDate) => {
    if (!filters.fromDate && !filters.toDate) return true;
    const date = new Date(transactionDate);
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesType =
      filters.types.length === 0 ||
      filters.types.includes(t.type) ||
      (filters.types.includes("MoneyIn") &&
        ["Income", "Borrowed", "Loan"].includes(t.type)) ||
      (filters.types.includes("MoneyOut") &&
        ["Expense", "Repayment"].includes(t.type));

    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(t.category);

    const matchesProvider =
      filters.providers.length === 0 ||
      filters.providers.includes(t.provider);

    const matchesMode =
      filters.modes.length === 0 ||
      filters.modes.includes(t.mode);

    const matchesDate = applyDateFilter(t.date);

    return matchesType && matchesCategory && matchesProvider && matchesMode && matchesDate;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === "Expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalBorrowed = filteredTransactions
    .filter(t => t.type === "Borrowed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRepaid = filteredTransactions
    .filter(t => t.type === "Repayment")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalLoan = filteredTransactions
    .filter(t => t.type === "Loan")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const loanOutstanding = totalLoan - totalRepaid;

  // const handleEdit = (transaction) => {
  //   const basePath = transaction.type === "Income" ? "/money-in/income"
  //     : transaction.type === "Expense" ? "/money-out/expense"
  //     : transaction.type === "Borrowed" ? "/money-in/borrowed"
  //     : transaction.type === "Loan" ? "/money-in/loans"
  //     : transaction.type === "Repayment" ? "/money-out/repayment"
  //     : "/dashboard";

  //   navigate(basePath); // Redirect to form (enhance later with prefilled edit mode)
  // };

  const handleDelete = async (id, model) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await API.delete(`/transactions/${id}/${model}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
      alert("Transaction deleted");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Failed to delete transaction");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading transactions...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;

  return (
    <div className="flex flex-col p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl text-blue-800 text-center mb-2">Transaction History</h1>
      <p className="text-center text-gray-600 mb-8">Track all your income, expenses, loans, and repayments in one place.</p>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Type */}
        <div>
          <h2 className="font-semibold mb-2 text-blue-700">Type</h2>
          {["MoneyIn", "MoneyOut", "Income", "Expense", "Borrowed", "Loan", "Repayment"].map(type => (
            <label key={type} className="block text-sm">
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={() => toggleFilter("types", type)}
                className="mr-1"
              />
              {type}
            </label>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h2 className="font-semibold mb-2 text-blue-700">Categories</h2>
          {["Salary", "Food", "Rent", "Medical", "Travel", "EMI", "Personal", "Borrowed"].map(cat => (
            <label key={cat} className="block text-sm">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleFilter("categories", cat)}
                className="mr-1"
              />
              {cat}
            </label>
          ))}
        </div>

        {/* Providers */}
        <div>
          <h2 className="font-semibold mb-2 text-blue-700">Providers</h2>
          {Array.from(new Set(transactions.map(t => t.provider))).map(prov => (
            <label key={prov} className="block text-sm">
              <input
                type="checkbox"
                checked={filters.providers.includes(prov)}
                onChange={() => toggleFilter("providers", prov)}
                className="mr-1"
              />
              {prov}
            </label>
          ))}
        </div>

        {/* Modes */}
        <div>
          <h2 className="font-semibold mb-2 text-blue-700">Modes</h2>
          {["Cash", "Bank", "UPI", "Card", "N/A"].map(mode => (
            <label key={mode} className="block text-sm">
              <input
                type="checkbox"
                checked={filters.modes.includes(mode)}
                onChange={() => toggleFilter("modes", mode)}
                className="mr-1"
              />
              {mode}
            </label>
          ))}
        </div>

        {/* Date Range */}
        <div>
          <h2 className="font-semibold mb-2 text-blue-700">Date Range</h2>
          <input
            type="date"
            className="border rounded p-2 w-full mb-1"
            value={filters.fromDate}
            onChange={e => setFilters({ ...filters, fromDate: e.target.value })}
          />
          <input
            type="date"
            className="border rounded p-2 w-full"
            value={filters.toDate}
            onChange={e => setFilters({ ...filters, toDate: e.target.value })}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-8 bg-white rounded-lg shadow">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="border px-4 py-3 text-left">Date</th>
              <th className="border px-4 py-3 text-left">Type</th>
              <th className="border px-4 py-3 text-left">Source/Provider</th>
              <th className="border px-4 py-3 text-left">Category/Mode</th>
              <th className="border px-4 py-3 text-left">Amount</th>
              <th className="border px-4 py-3 text-left">Notes</th>
              <th className="border px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-3">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-3 font-medium">{t.type}</td>
                  <td className="border px-4 py-3">{t.provider}</td>
                  <td className="border px-4 py-3 text-gray-700">
                    {t.category} / {t.mode}
                  </td>
                  <td
                    className={`border px-4 py-3 font-semibold ${
                      t.amount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {t.amount < 0 ? `- ₹${Math.abs(t.amount).toLocaleString()}` : `₹${t.amount.toLocaleString()}`}
                  </td>
                  <td className="border px-4 py-3 text-gray-600">{t.notes || "-"}</td>
                  <td className="border  px-4 py-3">
                    {/* <button
                      onClick={() => handleEdit(t)}
                      className="text-blue-600 hover:underline text-sm mr-3"
                    >
                      Edit
                    </button> */}
                    <button
                      onClick={() => handleDelete(t._id, t.model)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-sm text-green-800">Total Income</div>
          <div className="text-lg font-semibold">₹{totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <div className="text-sm text-red-800">Total Expense</div>
          <div className="text-lg font-semibold">₹{totalExpense.toLocaleString()}</div>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-sm text-blue-800">Net Balance</div>
          <div className="text-lg font-semibold">₹{netBalance.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <div className="text-sm text-yellow-800">Borrowed</div>
          <div className="text-lg font-semibold">₹{totalBorrowed.toLocaleString()}</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <div className="text-sm text-purple-800">Loan Outstanding</div>
          <div className="text-lg font-semibold">₹{loanOutstanding.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}