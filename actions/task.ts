"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

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
