"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) {
    return { error: "وارد کردن عنوان پروژه الزامی است" };
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    return { error: "خطای دسترسی: لطفا ابتدا وارد حساب کاربری شوید" };
  }

  const project = await db.project.create({
    data: {
      title,
      description,
      members: {
        create: {
          user_id: userId,
          role: "Admin",
        },
      },
    },
  });

  redirect(`/dashboard/projects/${project.id}`);
}
