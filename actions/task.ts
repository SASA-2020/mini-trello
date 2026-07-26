"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as "Low" | "Medium" | "High";
  const projectId = formData.get("projectId") as string;

  if (!title || !priority || !projectId) {
    return { error: "فیلدهای عنوان و اولویت الزامی هستند" };
  }

  await db.task.create({
    data: {
      title,
      description,
      priority,
      project_id: projectId,
    },
  });

  redirect(`/dashboard/projects/${projectId}`);
}

export async function updateTaskStatus(
  taskId: string,
  newStatus: "ToDo" | "InProgress" | "Done",
  projectId: string,
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!taskId || !newStatus || !projectId || !userId) {
    throw new Error("اطلاعات ناقص است");
  }

  const currentTask = await db.task.findUnique({
    where: { id: taskId },
    select: { status: true },
  });

  if (!currentTask) {
    throw new Error("تسک یافت نشد");
  }

  if (currentTask.status === newStatus) {
    return;
  }

  await db.$transaction([
    db.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    }),
    db.activityLog.create({
      data: {
        task_id: taskId,
        user_id: userId,
        old_status: currentTask.status,
        new_status: newStatus,
      },
    }),
  ]);

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function deleteTask(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const projectId = formData.get("projectId") as string;

  if (!taskId || !projectId) {
    throw new Error("شناسه تسک یا پروژه نامعتبر است.");
  }

  await db.task.delete({
    where: { id: taskId },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
}
export async function getTaskLogs(taskId: string) {
  if (!taskId) return [];

  const logs = await db.activityLog.findMany({
    where: { task_id: taskId },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return logs;
}

export async function updateTaskDetails(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as "Low" | "Medium" | "High";
  const assigneeId = formData.get("assigneeId") as string;

  if (!taskId || !projectId || !title) {
    throw new Error("عنوان تسک الزامی است");
  }

  await db.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      priority,
      assignee_id: assigneeId === "unassigned" ? null : assigneeId,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
}
