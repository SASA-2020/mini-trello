"use client";

import { useState, use } from "react";
import { createTask } from "@/actions/task";
import Link from "next/link";

export default function NewTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const res = await createTask(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">ایجاد تسک جدید</h1>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            بازگشت به بورد
          </Link>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <input type="hidden" name="projectId" value={projectId} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان تسک *
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="مثال: طراحی صفحه اصلی"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              placeholder="جزئیات این تسک را بنویسید..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اولویت *
            </label>
            <select
              name="priority"
              required
              defaultValue="Medium"
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
            >
              <option value="Low">پایین (Low)</option>
              <option value="Medium">متوسط (Medium)</option>
              <option value="High">بالا (High)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-4 text-white bg-blue-600 rounded-md font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all cursor-pointer"
          >
            افزودن تسک
          </button>
        </form>
      </div>
    </div>
  );
}
