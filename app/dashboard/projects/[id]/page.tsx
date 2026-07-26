import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import KanbanBoard from "@/components/KanbanBoard";

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

  const formattedTasks = project.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as "ToDo" | "InProgress" | "Done",
    priority: task.priority,
  }));

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
          <div className="space-x-4 flex items-center">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md font-medium hover:bg-gray-200 transition-colors"
            >
              بازگشت
            </Link>
            {membership.role === "Admin" && (
              <Link
                href={`/dashboard/projects/${projectId}/settings`}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                تنظیمات ⚙️
              </Link>
            )}
            <Link
              href={`/dashboard/projects/${projectId}/members`}
              className="px-4 py-2 text-blue-600 bg-blue-50 rounded-md font-medium hover:bg-blue-100 transition-colors border border-blue-100"
            >
              مدیریت اعضا
            </Link>

            <Link
              href={`/dashboard/projects/${projectId}/new-task`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              + تسک جدید
            </Link>
          </div>
        </div>

        <KanbanBoard initialTasks={formattedTasks} projectId={projectId} />
      </div>
    </div>
  );
}
