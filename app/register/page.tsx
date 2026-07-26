"use client";

import { useState } from "react";
import { registerUser } from "../../actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const res = await registerUser(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            ثبت‌نام در مینی ترلو
          </h2>
          <p className="text-sm text-gray-500">
            برای مدیریت پروژه‌های خود یک حساب کاربری بسازید
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="مثال: علی رضایی"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
              placeholder="example@mail.com"
              dir="ltr"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
              placeholder="********"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-4 text-white bg-blue-600 rounded-md font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all cursor-pointer"
          >
            ایجاد حساب کاربری
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          حساب کاربری دارید؟{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all"
          >
            وارد شوید
          </Link>
        </div>
      </div>
    </div>
  );
}
