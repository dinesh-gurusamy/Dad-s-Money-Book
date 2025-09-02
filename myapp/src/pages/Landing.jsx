// src/pages/Landing.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      login();

      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 py-12 sm:py-16 md:py-24 min-h-screen bg-blue-50">
      {/* Welcome Header */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-blue-800 text-center mb-3 sm:mb-4">
        Welcome Back, Dad! 👨‍💼
      </h1>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-center max-w-md">
        Keep track of every rupee — because your family counts on you.
      </p>

      {/* Login Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md border border-blue-100">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 border-b-2 border-blue-800 pb-2 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-blue-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-blue-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 sm:py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register
        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </button>
        </p> */}
      </div>
    </div>
  );
}
