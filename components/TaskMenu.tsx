"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { deleteTask } from "@/actions/task";
import Swal from "sweetalert2";

export default function TaskMenu({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
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
            className="block w-full text-right px-4 py-2 text-gray-400 cursor-not-allowed hover:bg-gray-50 transition-colors"
            disabled
          >
            ویرایش (بزودی)
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
  );
}
