import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../config/api";
import { useFilter } from "../../hooks/useFilter";

export default function LoanRepayments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    name: "",
    fromDate: "",
    toDate: "",
  });
  const [openHistory, setOpenHistory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/repayment/records");
        setData(res.data.loans);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.error("Failed to load loan records");
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
    <div className="flex flex-col p-4 md:p-10 min-h-screen">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl text-blue-800 text-center md:text-left">
          Loan Repayments
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          name="name"
          placeholder="Filter by Provider"
          value={filters.name}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-400 rounded"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-400 rounded"
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
          className="px-3 py-2 border border-gray-400 rounded"
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-400 rounded"
        />
        <button
          onClick={() =>
            setFilters({ status: "", name: "", fromDate: "", toDate: "" })
          }
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Provider
              </th>
              <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Borrowed Date
              </th>
              <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Last Paid
              </th>
              <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Total
              </th>
              <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Paid
              </th>
              <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Remaining
              </th>
              <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="border px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((l, i) => (
                <React.Fragment key={i}>
                  <tr className="hover:bg-gray-50">
                    <td className="border px-4 py-3 font-medium">{l.name}</td>
                    <td className="border px-4 py-3">{l.borrowedDate}</td>
                    <td className="border px-4 py-3">{l.lastPaidDate}</td>
                    <td className="border px-4 py-3">
                      ₹{l.total.toLocaleString()}
                    </td>
                    <td className="border px-4 py-3 text-green-700 font-medium">
                      ₹{l.paid.toLocaleString()}
                    </td>
                    <td className="border px-4 py-3 font-semibold">
                      ₹{l.remaining.toLocaleString()}
                    </td>
                    <td className="border px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          l.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="border px-4 py-3 text-center">
                      <button
                        onClick={() => toggleHistory(i)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {openHistory === i ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {openHistory === i && (
                    <tr>
                      <td colSpan="8" className="bg-gray-50 p-0">
                        <div className="p-4 border-t">
                          <h3 className="text-sm font-semibold mb-2">
                            Repayment History
                          </h3>
                          {l.history.length === 0 ? (
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
                                {l.history.map((r, idx) => (
                                  <tr key={idx} className="text-center">
                                    <td className="border px-2 py-1">
                                      {r.date}
                                    </td>
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
