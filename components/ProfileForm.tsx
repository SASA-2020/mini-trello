"use client";

import { useState } from "react";
import { updateUserProfile } from "@/actions/user";

export default function ProfileForm({
  user,
}: {
  user: { id: string; name: string; email: string };
}) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const res = await updateUserProfile(formData);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(res.message || "با موفقیت انجام شد");
    }

    setIsLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md border border-green-200">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نام و نام خانوادگی
        </label>
        <input
          type="text"
          name="name"
          defaultValue={user.name}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          آدرس ایمیل
        </label>
        <input
          type="email"
          name="email"
          defaultValue={user.email}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
          dir="ltr"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 text-white bg-blue-600 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 cursor-pointer"
      >
        {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
    </form>
  );
}
