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

export async function updateProjectDetails(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId || !projectId || !title) {
    return { error: "اطلاعات نامعتبر است" };
  }

  const membership = await db.projectMember.findUnique({
    where: { user_id_project_id: { user_id: userId, project_id: projectId } },
  });

  if (!membership || membership.role !== "Admin") {
    return { error: "شما دسترسی ویرایش این پروژه را ندارید" };
  }

  await db.project.update({
    where: { id: projectId },
    data: { title, description },
  });

  redirect(`/dashboard/projects/${projectId}`);
}

export async function deleteProject(projectId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId || !projectId) {
    return { error: "اطلاعات نامعتبر است" };
  }

  const members = await db.projectMember.findMany({
    where: { project_id: projectId },
    orderBy: { joined_at: "asc" },
  });

  const creatorId = members[0]?.user_id;

  if (userId !== creatorId) {
    return { error: "فقط سازنده اصلی می‌تواند پروژه را حذف کند" };
  }

  await db.project.delete({
    where: { id: projectId },
  });

  redirect("/dashboard");
}
