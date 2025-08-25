import React, { useState, useEffect } from "react";
import API from "../../config/api";
import { useFilter } from "../../hooks/useFilter";
import { useNavigate } from "react-router-dom";

export default function BorrowedRepayments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    name: "",
    fromDate: "",
    toDate: "",
  });
  const [openHistory, setOpenHistory] = useState(null); // Track which row's history is open
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/repayment/records");
        setData(res.data.borrowed);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.error("Failed to load borrowed records");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useFilter(data, filters);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleHistory = (id) => {
    setOpenHistory(openHistory === id ? null : id);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col p-4 sm:p-10 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 w-fit bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition text-sm"
      >
        ← Back
      </button>

      <h1 className="text-2xl sm:text-3xl text-blue-800 text-center mb-8">
        Borrowed Money
      </h1>

      {/* Filters */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          name="name"
          placeholder="Filter by Person"
          value={filters.name}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-400 rounded focus:outline-none"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-400 rounded focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-400 rounded focus:outline-none"
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-400 rounded focus:outline-none"
        />
        <button
          onClick={() =>
            setFilters({ status: "", name: "", fromDate: "", toDate: "" })
          }
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">
                Person
              </th>
              <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">
                Borrowed Date
              </th>
              <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">
                Last Paid
              </th>
              <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">
                Total
              </th>
              <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">
                Paid
              </th>
              <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">
                Remaining
              </th>
              <th className="border px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="border px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-700">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500 text-sm"
                >
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((b, i) => (
                <React.Fragment key={i}>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="border px-2 sm:px-4 py-2 sm:py-3 font-medium">
                      {b.name}
                    </td>
                    <td className="border px-2 sm:px-4 py-2 sm:py-3">
                      {b.borrowedDate}
                    </td>
                    <td className="border px-2 sm:px-4 py-2 sm:py-3">
                      {b.lastPaidDate}
                    </td>
                    <td className="border px-2 sm:px-4 py-2 sm:py-3">
                      ₹{b.total.toLocaleString()}
                    </td>
                    <td className="border px-2 sm:px-4 py-2 sm:py-3 text-green-700 font-medium">
                      ₹{b.paid.toLocaleString()}
                    </td>
                    <td className="border px-2 sm:px-4 py-2 sm:py-3 font-semibold">
                      ₹{b.remaining.toLocaleString()}
                    </td>
                    <td className="border px-2 sm:px-4 py-2 sm:py-3">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          b.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="border px-2 sm:px-4 py-2 sm:py-3 text-center">
                      <button
                        onClick={() => toggleHistory(i)}
                        className="text-blue-600 hover:underline text-xs sm:text-sm"
                      >
                        {openHistory === i ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {/* Repayment History Row */}
                  {openHistory === i && (
                    <tr>
                      <td colSpan="8" className="bg-gray-50 p-0">
                        <div className="p-2 sm:p-4 border-t">
                          <h3 className="text-sm font-semibold mb-2">
                            Repayment History
                          </h3>
                          {b.history.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                              No repayments recorded
                            </p>
                          ) : (
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border px-2 py-1">Date</th>
                                  <th className="border px-2 py-1">Amount</th>
                                  <th className="border px-2 py-1">Mode</th>
                                  <th className="border px-2 py-1">Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {b.history.map((r, idx) => (
                                  <tr key={idx} className="text-center">
                                    <td className="border px-2 py-1">{r.date}</td>
                                    <td className="border px-2 py-1">
                                      ₹{r.amount.toLocaleString()}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {r.mode}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {r.notes}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
