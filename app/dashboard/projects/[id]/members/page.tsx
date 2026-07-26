import { db } from "@/lib/db";
import Link from "next/link";
import AddMemberForm from "@/components/AddMemberForm";
import { redirect } from "next/navigation";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const members = await db.projectMember.findMany({
    where: { project_id: projectId },
    include: {
      user: true,
    },
    orderBy: { joined_at: "asc" },
  });

  if (!members) {
    redirect("/dashboard");
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Owner":
        return (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
            مالک
          </span>
        );
      case "Admin":
        return (
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
            ادمین
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
            عادی
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">مدیریت اعضای تیم</h1>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            بازگشت به بورد
          </Link>
        </div>

        <AddMemberForm projectId={projectId} />

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            اعضای فعلی پروژه
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">
              {members.length}
            </span>
          </h2>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.user_id}
                className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-800 flex items-center gap-2">
                    {member.user?.name || "کاربر بدون نام"}
                    {getRoleBadge(member.role)}
                  </div>
                  <div className="text-sm text-gray-500 font-mono mt-1">
                    {member.user?.email}
                  </div>
                </div>

                <button className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium p-2">
                  تنظیمات ⚙️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
