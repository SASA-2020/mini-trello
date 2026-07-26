"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

export async function updateTaskStatus(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const status = formData.get("status") as "ToDo" | "InProgress" | "Done";
  const projectId = formData.get("projectId") as string;

  if (!taskId || !status || !projectId) {
    throw new Error("اطلاعات ناقص است");
  }

  await db.task.update({
    where: { id: taskId },
    data: { status },
  });

  redirect(`/dashboard/projects/${projectId}`);
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

export async function updateTaskDetails(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as "Low" | "Medium" | "High";

  if (!taskId || !projectId || !title) {
    throw new Error("عنوان تسک الزامی است");
  }

  await db.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      priority,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
}
