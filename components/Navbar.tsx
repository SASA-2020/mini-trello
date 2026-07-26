"use client";

import Link from "next/link";
import { logoutUser } from "@/actions/auth";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="shrink-0 flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-blue-600 tracking-tight"
            >
              مینی ترلو
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              پروژه‌های من
            </Link>

            <div className="h-6 w-px bg-gray-300"></div>

            <form action={logoutUser}>
              <button
                type="submit"
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
              >
                خروج
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
