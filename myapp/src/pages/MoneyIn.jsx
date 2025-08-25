import React from "react";
import { Link } from "react-router-dom";

function MoneyIn() {
  return (
    <div className="flex flex-col p-8 sm:p-16 min-h-screen max-w-screen-lg mx-auto">
      <h1 className="text-3xl text-blue-800 text-center">Add Money In</h1>
      <div className="flex items-center mt-16 sm:mt-28 justify-center px-4 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 w-full">
          <div className="max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mx-auto">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Income
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              sources of income, including salary, freelance work, and other
              earnings to monitor your cash flow effectively.
            </p>
            <Link
              to="/money-in/income"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Income
            </Link>
          </div>
          <div className="max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mx-auto">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Borrowed
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              money you have borrowed from friends, family, or institutions, so
              you can manage repayments easily.
            </p>
            <Link
              to="/money-in/borrowed"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Borrowed Money
            </Link>
          </div>
          <div className="max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mx-auto">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Loan
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Record loans you have taken, and monitor due dates, interest, and
              repayments to stay financially organized.
            </p>
            <Link
              to="/money-in/loans"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Loan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoneyIn;