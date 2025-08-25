import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white">
      <div className="container mt-6 px-4 sm:px-8 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-lg font-bold">Dad’s Money Book</h1>

        {/* Desktop menu (unchanged) */}
        <ul className="hidden sm:flex space-x-10">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-blue-800 pb-2 block"
                  : "hover:text-blue-800 block"
              }
            >
              Dashboard
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/money-in"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-blue-800 pb-2 block"
                  : "hover:text-blue-800 block"
              }
            >
              Money In
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/money-out"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-blue-800 pb-2 block"
                  : "hover:text-blue-800 block"
              }
            >
              Money Out
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/track-repayments"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-blue-800 pb-2 block"
                  : "hover:text-blue-800 block"
              }
            >
              Track Repayments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-blue-800 pb-2 block"
                  : "hover:text-blue-800 block"
              }
            >
              Transactions
            </NavLink>
          </li>
        </ul>

        {/* User + Logout */}
        <div className="flex items-center space-x-4">
          <FaUserCircle className="h-9 w-9 text-black" />
          <button
            onClick={handleLogout}
            className="hidden sm:block bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>

          {/* Mobile toggle button */}
          <button
            className="sm:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 px-4">
          <ul className="flex flex-col space-y-4">
            <li>
              <NavLink
                to="/dashboard"
                className="block hover:text-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/money-in"
                className="block hover:text-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                Money In
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/money-out"
                className="block hover:text-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                Money Out
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/track-repayments"
                className="block hover:text-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                Track Repayments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/transactions"
                className="block hover:text-blue-800"
                onClick={() => setMenuOpen(false)}
              >
                Transactions
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
