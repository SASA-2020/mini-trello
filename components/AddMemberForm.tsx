"use client";

import { useState } from "react";
import { searchUsers, addMemberById } from "@/actions/member";

type SearchedUser = {
  id: string;
  name: string | null;
  email: string;
};

export default function AddMemberForm({ projectId }: { projectId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSearching(true);

    try {
      const res = await searchUsers(searchQuery);
      setSearchResults(res.users);
      if (res.users.length === 0) {
        setError("کاربری با این ایمیل یافت نشد");
      }
    } catch {
      setError("خطایی در جستجو رخ داد");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleAddUser(userId: string, userName: string | null) {
    setError(null);
    setSuccess(null);

    const res = await addMemberById(userId, projectId);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(
        `کاربر "${userName || "بدون نام"}" با موفقیت به پروژه اضافه شد`,
      );
      setSearchResults([]);
      setSearchQuery("");
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">دعوت عضو جدید</h2>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 mb-4 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSearch} className="flex gap-4 items-end mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            جستجو بر اساس ایمیل کاربر
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
            minLength={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
            placeholder="حداقل ۳ حرف..."
            dir="ltr"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-2 h-10.5 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors cursor-pointer disabled:bg-gray-400"
        >
          {isSearching ? "در حال جستجو..." : "جستجو"}
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-600">
            نتایج یافت شده:
          </div>
          <div className="divide-y divide-gray-100">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {user.name || "کاربر بدون نام"}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono mt-1">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => handleAddUser(user.id, user.name)}
                  className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-600 hover:text-white transition-all cursor-pointer text-sm font-medium"
                >
                  افزودن به تیم +
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
