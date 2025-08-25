// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages - Core
import Landing from "./pages/Landing";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import MoneyIn from "./pages/MoneyIn";
import MoneyOut from "./pages/MoneyOut";
import Transactions from "./pages/Transactions";

// Money In/Out Forms
import Income from "./pages/moneyin/Income";
import Borrowed from "./pages/moneyin/Borrowed";
import Loans from "./pages/moneyin/Loans";
import Expense from "./pages/moneyout/Expense";
import Repayment from "./pages/moneyout/Repayment";

// Repayment Tracking
import TrackRepayments from "./pages/TrackRepayments";
import BorrowedRepayments from "./pages/trackrepayments/BorrowedRepayments";
import LoanRepayments from "./pages/trackrepayments/LoanRepayments";


// Components
import Navbar from "./components/Navbar";

// Private Route
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

// Public Route (Redirect if logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

// AppContent (uses useLocation)
function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide Navbar on landing page
  const hideNavbar = location.pathname === "/" && !isAuthenticated;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Core Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/money-in"
          element={
            <PrivateRoute>
              <MoneyIn />
            </PrivateRoute>
          }
        />
        <Route
          path="/money-out"
          element={
            <PrivateRoute>
              <MoneyOut />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          }
        />

        {/* Money In Forms */}
        <Route
          path="/money-in/income"
          element={
            <PrivateRoute>
              <Income />
            </PrivateRoute>
          }
        />
        <Route
          path="/money-in/borrowed"
          element={
            <PrivateRoute>
              <Borrowed />
            </PrivateRoute>
          }
        />
        <Route
          path="/money-in/loans"
          element={
            <PrivateRoute>
              <Loans />
            </PrivateRoute>
          }
        />

        {/* Money Out Forms */}
        <Route
          path="/money-out/expense"
          element={
            <PrivateRoute>
              <Expense />
            </PrivateRoute>
          }
        />
        <Route
          path="/money-out/repayment"
          element={
            <PrivateRoute>
              <Repayment />
            </PrivateRoute>
          }
        />

        {/* Repayment Tracking */}
        <Route
          path="/track-repayments"
          element={
            <PrivateRoute>
              <TrackRepayments />
            </PrivateRoute>
          }
        />
        <Route
          path="/track-repayments/borrowed-repayments"
          element={
            <PrivateRoute>
              <BorrowedRepayments />
            </PrivateRoute>
          }
        />
        <Route
          path="/track-repayments/loan-repayments"
          element={
            <PrivateRoute>
              <LoanRepayments />
            </PrivateRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}