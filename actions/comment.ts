"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addComment(formData: FormData) {
  const content = formData.get("content") as string;
  const taskId = formData.get("taskId") as string;
  const projectId = formData.get("projectId") as string;

  if (!content || !taskId || !projectId) {
    throw new Error("متن کامنت نمی‌تواند خالی باشد");
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    throw new Error("خطای دسترسی: لطفا ابتدا وارد حساب کاربری شوید");
  }

  await db.comment.create({
    data: {
      content,
      task_id: taskId,
      user_id: userId,
    },
  });

  redirect(`/dashboard/projects/${projectId}/tasks/${taskId}`);
}
