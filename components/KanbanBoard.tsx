"use client";

import { useState } from "react";
import TaskMenu from "./TaskMenu";
import { updateTaskStatus } from "@/actions/task";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "ToDo" | "InProgress" | "Done";
  priority: string;
  assignee_id: string | null;
  assignee: { name: string } | null;
  due_date: Date | string | null;
};

type Member = { id: string; name: string };

export default function KanbanBoard({
  initialTasks,
  projectId,
  members,
  currentUserId,
}: {
  initialTasks: Task[];
  projectId: string;
  members: Member[];
  currentUserId: string;
}) {
  const [prevInitialTasks, setPrevInitialTasks] = useState(initialTasks);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [filterMode, setFilterMode] = useState<"all" | "mine">("all");

  if (initialTasks !== prevInitialTasks) {
    setPrevInitialTasks(initialTasks);
    setTasks(initialTasks);
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent,
    newStatus: "ToDo" | "InProgress" | "Done",
  ) => {
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );
    await updateTaskStatus(taskId, newStatus, projectId);
  };

  const visibleTasks =
    filterMode === "mine"
      ? tasks.filter((task) => task.assignee_id === currentUserId)
      : tasks;

  const renderColumn = (
    title: string,
    status: "ToDo" | "InProgress" | "Done",
    bgColor: string,
    borderColor: string,
  ) => {
    const columnTasks = visibleTasks.filter((task) => task.status === status);

    return (
      <div
        className={`${bgColor} ${borderColor} border rounded-xl p-4 flex flex-col min-h-125 transition-colors`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b flex justify-between items-center">
          {title}
          <span className="bg-white text-gray-500 text-xs px-2 py-1 rounded-full shadow-sm">
            {columnTasks.length}
          </span>
        </h2>

        <div className="flex-1 space-y-3">
          {columnTasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group flex flex-col"
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`font-medium text-gray-800 leading-tight ${status === "Done" ? "line-through opacity-70" : ""}`}
                >
                  {task.title}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <TaskMenu
                    projectId={projectId}
                    taskId={task.id}
                    taskTitle={task.title}
                    taskDescription={task.description}
                    taskPriority={task.priority}
                    assigneeId={task.assignee_id}
                    members={members}
                    taskDueDate={task.due_date}
                  />
                </div>
              </div>

              {task.description && (
                <p
                  className={`text-sm text-gray-500 line-clamp-2 mt-2 ${status === "Done" ? "opacity-70" : ""}`}
                >
                  {task.description}
                </p>
              )}
              {task.due_date && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-md w-fit border border-gray-100">
                  <span>📅</span>
                  <span>
                    {new Date(task.due_date).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`text-xs px-2 py-1 rounded-md font-medium ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority === "High"
                    ? "بالا"
                    : task.priority === "Medium"
                      ? "متوسط"
                      : "پایین"}
                </span>

                {task.assignee ? (
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${
                      task.assignee_id === currentUserId
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-purple-50 text-purple-700 border-purple-100"
                    }`}
                  >
                    <span>👤</span>
                    <span>{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-xs bg-gray-50 text-gray-400 px-2 py-1 rounded-full border border-gray-100">
                    بدون مسئول
                  </span>
                )}
              </div>
            </div>
          ))}

          {columnTasks.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-8 border-2 border-dashed border-gray-200 rounded-lg py-8">
              {filterMode === "mine"
                ? "شما در این وضعیت تسکی ندارید"
                : "تسک‌ها را اینجا رها کنید"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${filterMode === "all" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            همه تسک‌ها
          </button>
          <button
            onClick={() => setFilterMode("mine")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${filterMode === "mine" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            فقط تسک‌های من
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderColumn("برای انجام", "ToDo", "bg-gray-50", "border-gray-200")}
        {renderColumn(
          "در حال انجام",
          "InProgress",
          "bg-blue-50/50",
          "border-blue-100",
        )}
        {renderColumn(
          "تکمیل شده",
          "Done",
          "bg-green-50/50",
          "border-green-100",
        )}
      </div>
    </div>
  );
}
