"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function searchUsers(emailQuery: string) {
  if (!emailQuery || emailQuery.trim().length < 3) {
    return { users: [] };
  }

  const users = await db.user.findMany({
    where: {
      email: {
        contains: emailQuery,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: 5,
  });

  return { users };
}

export async function addMemberById(userId: string, projectId: string) {
  if (!userId || !projectId) {
    return { error: "اطلاعات ارسالی نامعتبر است" };
  }

  const existingMember = await db.projectMember.findUnique({
    where: {
      user_id_project_id: {
        user_id: userId,
        project_id: projectId,
      },
    },
  });

  if (existingMember) {
    return { error: "این کاربر از قبل در تیم شما حضور دارد" };
  }

  await db.projectMember.create({
    data: {
      user_id: userId,
      project_id: projectId,
      role: "Member",
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}/members`);
  return { success: true };
}
