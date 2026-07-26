import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const userMemberships = await db.projectMember.findMany({
    where: { user_id: userId },
    include: {
      project: true,
    },
  });

  const projects = userMemberships.map((m) => m.project);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">داشبورد پروژه‌ها</h1>
          <Link
            href="/dashboard/new-project"
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            + پروژه جدید
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4">شما هنوز هیچ پروژه‌ای ندارید</p>
            <Link
              href="/dashboard/new-project"
              className="text-blue-600 hover:underline font-medium"
            >
              اولین پروژه خود را بسازید
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
