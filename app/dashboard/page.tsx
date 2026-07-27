import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const projects = await db.project.findMany({
    where: {
      members: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      tasks: true,
      members: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  let totalTasks = 0;
  let completedTasks = 0;
  let overdueTasks = 0;
  const now = new Date();

  projects.forEach((project) => {
    totalTasks += project.tasks.length;
    project.tasks.forEach((task) => {
      if (task.status === "Done") {
        completedTasks++;
      }

      if (task.status !== "Done" && task.deadline) {
        const taskDeadline = new Date(task.deadline);
        if (taskDeadline < now) {
          overdueTasks++;
        }
      }
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              داشبورد فضای کاری
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              نمای کلی پروژه‌ها و وضعیت کارها
            </p>
          </div>
          <Link
            href="/dashboard/new-project"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <span>+</span>
            <span>پروژه جدید</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl shadow-sm">
              📋
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                کل تسک‌های پروژه‌ها
              </p>
              <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl shadow-sm">
              ✅
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                تسک‌های انجام‌شده
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {completedTasks}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl shadow-sm">
              ⏰
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                تسک‌های تاخیرخورده
              </p>
              <p className="text-3xl font-bold text-gray-800">{overdueTasks}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700 px-1">
            پروژه‌های اخیر شما
          </h2>

          {projects.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center flex flex-col items-center justify-center">
              <span className="text-4xl mb-4 opacity-50">📂</span>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                هنوز پروژه‌ای ندارید!
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md">
                برای شروع مدیریت کارها، اولین پروژه خود را ایجاد کنید و اعضای
                تیمتان را به آن دعوت کنید.
              </p>
              <Link
                href="/dashboard/new-project"
                className="bg-blue-50 text-blue-700 border border-blue-200 px-6 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
              >
                ایجاد اولین پروژه
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const projectProgress =
                  project.tasks.length > 0
                    ? Math.round(
                        (project.tasks.filter((t) => t.status === "Done")
                          .length /
                          project.tasks.length) *
                          100,
                      )
                    : 0;

                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                        {project.members.length} عضو
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
                      {project.description || "بدون توضیحات"}
                    </p>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <span>پیشرفت پروژه</span>
                        <span className="font-medium text-gray-700">
                          {projectProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${projectProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
