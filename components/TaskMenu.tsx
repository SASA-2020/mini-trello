"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { deleteTask, updateTaskDetails } from "@/actions/task";
import Swal from "sweetalert2";

export default function TaskMenu({
  projectId,
  taskId,
  taskTitle,
  taskDescription,
  taskPriority,
}: {
  projectId: string;
  taskId: string;
  taskTitle: string;
  taskDescription: string | null;
  taskPriority: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteClick = async () => {
    setIsOpen(false);

    const result = await Swal.fire({
      title: "حذف تسک",
      text: "آیا از حذف این تسک اطمینان دارید؟ این عمل غیرقابل بازگشت است.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "انصراف",
      customClass: {
        popup: "rounded-xl shadow-lg border border-gray-100 font-sans",
      },
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append("taskId", taskId);
      formData.append("projectId", projectId);

      await deleteTask(formData);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    await updateTaskDetails(formData);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:bg-gray-200 p-1 rounded-md transition-colors cursor-pointer"
          title="عملیات"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-sm overflow-hidden">
            <Link
              href={`/dashboard/projects/${projectId}/tasks/${taskId}`}
              className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
            >
              مشاهده و نظرات
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                setIsEditModalOpen(true);
              }}
              className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              ویرایش تسک
            </button>

            <button
              onClick={handleDeleteClick}
              className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              حذف تسک
            </button>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">ویرایش تسک</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form action={handleEditSubmit} className="p-6 space-y-4">
              <input type="hidden" name="taskId" value={taskId} />
              <input type="hidden" name="projectId" value={projectId} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان تسک *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={taskTitle}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={taskDescription || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اولویت *
                </label>
                <select
                  name="priority"
                  required
                  defaultValue={taskPriority}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                >
                  <option value="Low">پایین (Low)</option>
                  <option value="Medium">متوسط (Medium)</option>
                  <option value="High">بالا (High)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-white bg-blue-600 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  ذخیره تغییرات
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 text-gray-700 bg-gray-100 rounded-md font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
