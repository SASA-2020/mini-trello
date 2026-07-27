"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { deleteTask, updateTaskDetails, getTaskLogs } from "@/actions/task";
import Swal from "sweetalert2";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type ActivityLog = {
  id: string;
  old_status: string;
  new_status: string;
  created_at: Date | string;
  user: { name: string };
};

type Member = { id: string; name: string };

export default function TaskMenu({
  projectId,
  taskId,
  taskTitle,
  taskDescription,
  taskPriority,
  assigneeId,
  members,
  taskDueDate,
}: {
  projectId: string;
  taskId: string;
  taskTitle: string;
  taskDescription: string | null;
  taskPriority: string;
  assigneeId: string | null;
  members: Member[];
  taskDueDate: Date | string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateObject | null>(
    taskDueDate ? new DateObject(new Date(taskDueDate)) : null,
  );
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

  const handleViewLogs = async () => {
    setIsOpen(false);
    setIsLogModalOpen(true);
    setIsLoadingLogs(true);
    try {
      const fetchedLogs = await getTaskLogs(taskId);
      setLogs(fetchedLogs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const translateStatus = (status: string) => {
    if (status === "ToDo") return "برای انجام";
    if (status === "InProgress") return "در حال انجام";
    if (status === "Done") return "تکمیل شده";
    return status;
  };
  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:bg-gray-200 p-1 rounded-md transition-colors cursor-pointer"
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
          <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-sm overflow-hidden">
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
              onClick={handleViewLogs}
              className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              تاریخچه فعالیت‌ها
            </button>
            <button
              onClick={handleDeleteClick}
              className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-gray-100 mt-1"
            >
              حذف تسک
            </button>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-right">
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

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مسئول تسک
                  </label>
                  <select
                    name="assigneeId"
                    defaultValue={assigneeId || "unassigned"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                  >
                    <option value="unassigned">بدون مسئول</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="hidden"
                  name="dueDate"
                  value={
                    selectedDate ? selectedDate.toDate().toISOString() : ""
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاریخ سررسید
                  </label>
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    placeholder="انتخاب تاریخ"
                    inputClass="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                    containerStyle={{ width: "100%" }}
                  />
                </div>
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

      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                تاریخچه فعالیت‌ها
              </h2>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-right">
              {isLoadingLogs ? (
                <div className="text-center text-gray-500 py-8">
                  در حال بارگذاری اطلاعات...
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  هیچ تغییری برای این تسک ثبت نشده است
                </div>
              ) : (
                <div className="space-y-6">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="relative pl-4 border-r-2 border-blue-200 pr-6"
                    >
                      <div className="absolute -right-1.25 top-1.5 w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        <span className="font-bold text-blue-700">
                          {log.user.name}
                        </span>{" "}
                        وضعیت تسک را از{" "}
                        <span className="font-semibold text-gray-600 px-1 bg-gray-100 rounded">
                          {translateStatus(log.old_status)}
                        </span>{" "}
                        به{" "}
                        <span className="font-semibold text-gray-900 px-1 bg-blue-50 rounded">
                          {translateStatus(log.new_status)}
                        </span>{" "}
                        تغییر داد.
                      </p>
                      <span
                        className="text-xs text-gray-400 mt-2 block"
                        dir="ltr"
                        style={{ textAlign: "right" }}
                      >
                        {new Date(log.created_at).toLocaleString("fa-IR")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
