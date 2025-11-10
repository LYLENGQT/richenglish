import React from "react";
import { Link } from "react-router-dom";
// (Header and Footer imports kept if you have those components, otherwise they can be removed)
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center">
          <p className="text-base font-semibold text-blue-600">404</p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Sorry, we couldn’t find the page you’re looking for. It might have
            been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go back home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Contact support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
