import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const membership = await db.projectMember.findUnique({
    where: {
      user_id_project_id: {
        user_id: userId,
        project_id: projectId,
      },
    },
    include: {
      project: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!membership) {
    redirect("/dashboard");
  }

  const project = membership.project;
  const tasks = project.tasks;

  const todoTasks = tasks.filter((t) => t.status === "ToDo");
  const inProgressTasks = tasks.filter((t) => t.status === "InProgress");
  const doneTasks = tasks.filter((t) => t.status === "Done");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-gray-500 mt-1">{project.description}</p>
            )}
          </div>
          <div className="space-x-4 space-x-reverse flex items-center">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md font-medium hover:bg-gray-200 transition-colors"
            >
              بازگشت
            </Link>
            <Link
              href={`/dashboard/projects/${projectId}/new-task`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              + تسک جدید
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="bg-gray-100 p-4 rounded-xl">
            <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
              برای انجام
              <span className="bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-sm">
                {todoTasks.length}
              </span>
            </h2>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                </div>
              ))}
              {todoTasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  تسکی وجود ندارد
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h2 className="font-semibold text-blue-700 mb-4 flex items-center justify-between">
              در حال انجام
              <span className="bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-sm">
                {inProgressTasks.length}
              </span>
            </h2>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-blue-200"
                >
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                </div>
              ))}
              {inProgressTasks.length === 0 && (
                <p className="text-sm text-blue-400 text-center py-2">
                  تسکی وجود ندارد
                </p>
              )}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <h2 className="font-semibold text-green-700 mb-4 flex items-center justify-between">
              تکمیل شده
              <span className="bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-sm">
                {doneTasks.length}
              </span>
            </h2>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-green-200"
                >
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                </div>
              ))}
              {doneTasks.length === 0 && (
                <p className="text-sm text-green-400 text-center py-2">
                  تسکی وجود ندارد
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
