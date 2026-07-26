import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { addComment } from "@/actions/comment";

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;
  const taskId = resolvedParams.taskId;

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      comments: {
        include: { user: true },
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!task) {
    redirect(`/dashboard/projects/${projectId}`);
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case "ToDo":
        return "برای انجام";
      case "InProgress":
        return "در حال انجام";
      case "Done":
        return "تکمیل شده";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  وضعیت: {translateStatus(task.status)}
                </span>
                <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded">
                  اولویت: {task.priority}
                </span>
              </div>
            </div>
            <Link
              href={`/dashboard/projects/${projectId}`}
              className="text-gray-500 hover:text-gray-800 font-medium bg-gray-100 px-4 py-2 rounded-md transition-colors"
            >
              بازگشت به بورد
            </Link>
          </div>

          <div className="mt-6 border-t pt-4 border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              توضیحات تسک:
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {task.description || "توضیحاتی برای این تسک ثبت نشده است."}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            نظرات و گفتگوها
          </h2>

          <form action={addComment} className="mb-8 space-y-3">
            <input type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="projectId" value={projectId} />
            <textarea
              name="content"
              required
              rows={3}
              placeholder="نظر خود را بنویسید..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer font-medium"
            >
              ارسال نظر
            </button>
          </form>

          <div className="space-y-4">
            {task.comments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                هنوز نظری ثبت نشده است
              </p>
            ) : (
              task.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800 text-sm">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
