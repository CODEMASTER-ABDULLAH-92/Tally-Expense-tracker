import React from "react";
import Link from "next/link";
const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl shadow-md p-8 text-center">
        <div className="text-5xl mb-4">📌</div>

        <h1 className="text-2xl font-bold text-gray-800">
          Registration Required
        </h1>

        <p className="mt-3 text-gray-600 leading-relaxed">
          To add your expenses, you need to contact the admin for account
          registration and access.
        </p>

        <Link  href={`https://abdullahdev92.vercel.app/#contact`}
          className="mt-6 px-6 py-2 rounded-lg border bg-blue-600 text-black font-medium hover:bg-blue-700 transition"
        >
          Contact Admin
        </Link>
      </div>
    </div>
  );
};

export default Page;