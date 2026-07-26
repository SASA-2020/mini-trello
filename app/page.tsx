import Link from "next/link";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden py-20">
        <div className="absolute top-[0%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

        <div className="z-10 text-center max-w-3xl mx-auto space-y-8 p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight leading-tight">
            به{" "}
            <span className="text-blue-600 bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              مینی ترلو
            </span>{" "}
            خوش آمدید
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed md:px-12">
            ساده‌ترین و سریع‌ترین ابزار برای مدیریت پروژه‌ها، پیگیری تسک‌ها و
            همکاری موثر با اعضای تیم. همین حالا فضای کاری خود را بسازید!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                ورود به داشبورد فضای کاری ➔
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  ثبت‌نام رایگان
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white text-blue-700 font-medium rounded-xl shadow-sm border border-blue-100 hover:bg-blue-50 transition-all"
                >
                  ورود به حساب کاربری
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
