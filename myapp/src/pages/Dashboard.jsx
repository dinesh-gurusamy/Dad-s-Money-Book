// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import API from "../config/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState({
    income: 0,
    expenses: 0,
    borrowed: 0,
    repaid: 0,
    loanOutstanding: 0,
    netBalance: 0,
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/dashboard");
        setData(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col p-10 min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const formatAmount = (amount) => amount.toLocaleString("en-IN");
  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="flex flex-col p-6 md:p-10 min-h-screen bg-gray-50">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-blue-800 text-center mb-8">
        Dashboard Overview
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <StatCard
          title="Income"
          value={`₹${formatAmount(data.income)}`}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          title="Expenses"
          value={`₹${formatAmount(data.expenses)}`}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          title="Borrowed"
          value={`₹${formatAmount(data.borrowed)}`}
          color="text-orange-600"
          bg="bg-orange-50"
        />
        <StatCard
          title="Repaid"
          value={`₹${formatAmount(data.repaid)}`}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          title="Loan Outstanding"
          value={`₹${formatAmount(data.loanOutstanding)}`}
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      {/* Net Balance */}
      <div className="p-6 bg-white border rounded-xl shadow-sm mb-8 text-center transition hover:shadow-md">
        <h2 className="text-xl font-bold mb-2">Net Balance</h2>
        <p
          className={`text-3xl font-bold ${
            data.netBalance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          ₹{formatAmount(data.netBalance)}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          {data.netBalance >= 0 ? "Available for savings" : "Deficit to cover"}
        </p>
      </div>

      {/* Progress Bars */}
      {/* <div className="p-6 bg-white border rounded-xl shadow-sm mb-8 transition hover:shadow-md"> */}
        {/* <h2 className="text-xl font-bold mb-5">Spending Overview</h2> */}

        {/* Expenses vs Income */}
        {/* <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Expenses vs Income</span>
            <span>{data.income ? Math.round((data.expenses / data.income) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${data.income ? (data.expenses / data.income) * 100 : 0}%` }}
            />
          </div>
        </div> */}

        {/* Repaid vs Borrowed */}
        {/* <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Repayment Progress</span>
            <span>{data.borrowed ? Math.round((data.repaid / data.borrowed) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${data.borrowed ? (data.repaid / data.borrowed) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div> */}

      {/* Upcoming Payments */}
      <div className="p-6 bg-white border rounded-xl shadow-sm transition hover:shadow-md">
        <h2 className="text-xl font-bold mb-4">Upcoming Payments</h2>
        {data.upcoming.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No upcoming payments due soon</p>
        ) : (
          <ul className="space-y-3">
            {data.upcoming.map((item, i) => (
              <li
                key={i}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg border-l-4 border-red-400"
              >
                <span className="font-medium text-gray-800">{item.label}</span>
                <span className="text-red-600 font-semibold text-sm mt-1 sm:mt-0">
                  Due: {formatDate(item.dueDate)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 text-center">
        <Link
          to="/money-in"
          className="inline-block mr-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Add Income
        </Link>
        <Link
          to="/money-out"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add Expense
        </Link>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, color, bg }) {
  return (
    <div className={`${bg} p-5 border rounded-xl shadow-sm text-center transition hover:shadow-md`}>
      <h5 className="text-lg font-semibold text-gray-700">{title}</h5>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}