"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    return { error: "شما وارد سایت نشده‌اید" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    return { error: "نام و ایمیل الزامی است" };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return { error: "این ایمیل قبلاً توسط کاربر دیگری ثبت شده است" };
    }

    await db.user.update({
      where: { id: userId },
      data: { name, email },
    });

    revalidatePath("/dashboard/profile");
    return { success: true, message: "اطلاعات با موفقیت بروزرسانی شد" };
  } catch {
    return { error: "خطایی در بروزرسانی اطلاعات رخ داد" };
  }
}
