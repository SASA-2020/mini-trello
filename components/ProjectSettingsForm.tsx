"use client";

import { useState } from "react";
import Link from "next/link";
import { updateProjectDetails, deleteProject } from "@/actions/project";
import Swal from "sweetalert2";

type Project = {
  id: string;
  title: string;
  description: string | null;
};

export default function ProjectSettingsForm({ project }: { project: Project }) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleUpdate(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    const res = await updateProjectDetails(formData);
    if (res?.error) {
      setError(res.error);
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const result = await Swal.fire({
      title: "حذف کامل پروژه",
      text: "آیا از حذف این پروژه اطمینان دارید؟ تمام تسک‌ها و اطلاعات برای همیشه پاک خواهند شد!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "بله، پروژه را حذف کن",
      cancelButtonText: "انصراف",
      customClass: {
        popup: "rounded-xl shadow-lg border border-gray-100 font-sans",
      },
    });

    if (result.isConfirmed) {
      const res = await deleteProject(project.id);
      if (res?.error) {
        Swal.fire("خطای دسترسی", res.error, "error");
      }
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">تنظیمات پروژه</h1>
          <Link
            href={`/dashboard/projects/${project.id}`}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            بازگشت به بورد
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            ویرایش مشخصات
          </h2>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <form action={handleUpdate} className="space-y-4">
            <input type="hidden" name="projectId" value={project.id} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان پروژه *
              </label>
              <input
                type="text"
                name="title"
                defaultValue={project.title}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="عنوان جدید را وارد کنید"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات
              </label>
              <textarea
                name="description"
                defaultValue={project.description || ""}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                placeholder="توضیحات پروژه..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-4 text-white bg-blue-600 rounded-md font-medium hover:bg-blue-700 transition-all cursor-pointer disabled:bg-blue-400"
            >
              {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </form>
        </div>

        <div className="bg-red-50 p-6 rounded-xl border border-red-100 mt-8">
          <h2 className="text-lg font-bold text-red-800 mb-2">منطقه خطر</h2>
          <p className="text-sm text-red-600 mb-4">
            با حذف پروژه، تمامی تسک‌ها، نظرات و لاگ‌های فعالیت برای تمامی اعضا
            پاک خواهد شد. این عمل غیرقابل بازگشت است و فقط سازنده پروژه قادر به
            انجام آن می‌باشد.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            حذف کامل پروژه
          </button>
        </div>
      </div>
    </div>
  );
}
