import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-gray-50 to-gray-100 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="z-10 text-center max-w-3xl mx-auto space-y-8 p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight leading-tight">
          به{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
            مینی ترلو
          </span>{" "}
          خوش آمدید
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed md:px-12">
          ساده‌ترین و سریع‌ترین ابزار برای مدیریت پروژه‌ها، پیگیری تسک‌ها و
          همکاری موثر با اعضای تیم. همین حالا فضای کاری خود را بسازید
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-4">
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
        </div>
      </div>
    </main>
  );
}
