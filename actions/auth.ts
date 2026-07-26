"use server";

import { db } from "../lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "تمامی فیلدها الزامی هستند" };
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "این ایمیل قبلا در سیستم ثبت شده است" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
    },
  });

  redirect("/login");
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "لطفاً ایمیل و رمز عبور را وارد کنید." };
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "کاربری با این ایمیل یافت نشد." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return { error: "رمز عبور اشتباه است." };
  }

  (await cookies()).set("user_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/dashboard");
}
