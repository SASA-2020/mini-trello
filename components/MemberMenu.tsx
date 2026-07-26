"use client";

import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { updateMemberRole, removeMember } from "@/actions/member";

interface MemberMenuProps {
  projectId: string;
  userId: string;
  userName: string | null;
  currentRole: "Admin" | "Member";
}

export default function MemberMenu({
  projectId,
  userId,
  userName,
  currentRole,
}: MemberMenuProps) {
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

  const handleRoleChange = async () => {
    setIsOpen(false);
    const newRole = currentRole === "Admin" ? "Member" : "Admin";
    await updateMemberRole(userId, projectId, newRole);
  };

  const handleRemoveClick = async () => {
    setIsOpen(false);
    const result = await Swal.fire({
      title: "حذف عضو",
      text: `آیا از حذف "${userName || "این کاربر"}" از پروژه اطمینان دارید؟`,
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
      await removeMember(userId, projectId);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-2 rounded-md transition-colors cursor-pointer text-sm font-medium flex items-center gap-1"
        title="تنظیمات کاربر"
      >
        تنظیمات ⚙️
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-sm overflow-hidden">
          <button
            onClick={handleRoleChange}
            className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer border-b border-gray-100"
          >
            {currentRole === "Admin"
              ? "تبدیل به عضو عادی ↓"
              : "ارتقا به ادمین ↑"}
          </button>

          <button
            onClick={handleRemoveClick}
            className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
          >
            حذف از پروژه ✕
          </button>
        </div>
      )}
    </div>
  );
}
