"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
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

export async function updateMemberRole(
  userId: string,
  projectId: string,
  newRole: "Admin" | "Member",
) {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user_session")?.value;

  if (!currentUserId || !userId || !projectId || !newRole)
    return { error: "اطلاعات نامعتبر است" };

  if (currentUserId === userId)
    return { error: "شما نمی‌توانید نقش خود را تغییر دهید" };

  const members = await db.projectMember.findMany({
    where: { project_id: projectId },
    orderBy: { joined_at: "asc" },
  });

  const creatorId = members[0]?.user_id;
  const currentUserMembership = members.find(
    (m) => m.user_id === currentUserId,
  );
  const targetUserMembership = members.find((m) => m.user_id === userId);

  if (!currentUserMembership || currentUserMembership.role !== "Admin") {
    return { error: "شما دسترسی لازم برای این کار را ندارید" };
  }

  if (currentUserId !== creatorId && targetUserMembership?.role === "Admin") {
    return { error: "فقط سازنده پروژه می‌تواند نقش ادمین‌ها را تغییر دهد" };
  }

  await db.projectMember.update({
    where: {
      user_id_project_id: { user_id: userId, project_id: projectId },
    },
    data: { role: newRole },
  });

  revalidatePath(`/dashboard/projects/${projectId}/members`);
  return { success: true };
}

export async function removeMember(userId: string, projectId: string) {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user_session")?.value;

  if (!currentUserId || !userId || !projectId)
    return { error: "اطلاعات نامعتبر است" };

  if (currentUserId === userId)
    return { error: "شما نمی‌توانید خودتان را از پروژه حذف کنید" };

  const members = await db.projectMember.findMany({
    where: { project_id: projectId },
    orderBy: { joined_at: "asc" },
  });

  const creatorId = members[0]?.user_id;
  const currentUserMembership = members.find(
    (m) => m.user_id === currentUserId,
  );
  const targetUserMembership = members.find((m) => m.user_id === userId);

  if (!currentUserMembership || currentUserMembership.role !== "Admin") {
    return { error: "شما دسترسی لازم برای این کار را ندارید" };
  }

  if (currentUserId !== creatorId && targetUserMembership?.role === "Admin") {
    return { error: "فقط سازنده پروژه می‌تواند ادمین‌های دیگر را حذف کند" };
  }

  await db.$transaction([
    db.task.updateMany({
      where: { project_id: projectId, assignee_id: userId },
      data: { assignee_id: null },
    }),
    db.projectMember.delete({
      where: {
        user_id_project_id: { user_id: userId, project_id: projectId },
      },
    }),
  ]);

  revalidatePath(`/dashboard/projects/${projectId}/members`);
  return { success: true };
}
