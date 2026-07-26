import Link from "next/link";
import { logoutUser } from "@/actions/auth";
import { cookies } from "next/headers";

export default async function Navbar() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 tracking-tight"
            >
              مینی ترلو
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {userId ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  پروژه‌های من
                </Link>

                <div className="h-6 w-px bg-gray-300"></div>

                <form action={logoutUser}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    خروج
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  ورود
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
