import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ProjectSettingsForm from "@/components/ProjectSettingsForm";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { id: true, title: true, description: true },
  });

  if (!project) {
    redirect("/dashboard");
  }

  return <ProjectSettingsForm project={project} />;
}
