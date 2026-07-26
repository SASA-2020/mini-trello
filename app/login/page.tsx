"use client";

import { useState } from "react";
import { loginUser } from "../../actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const res = await loginUser(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          ورود به حساب کاربری
        </h2>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 text-white bg-blue-600 rounded-md font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all cursor-pointer"
          >
            ورود
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          حساب کاربری ندارید؟{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            ثبت‌نام کنید
          </Link>
        </div>
      </div>
    </div>
  );
}
