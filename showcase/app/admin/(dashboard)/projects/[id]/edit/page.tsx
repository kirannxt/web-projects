import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) notFound();

  let tags: string[] = [];
  try { tags = JSON.parse(project.tags); } catch { tags = []; }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Update &ldquo;{project.title}&rdquo;
        </p>
      </div>
      <ProjectForm
        initialData={{
          id: project.id,
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl ?? "",
          demoUrl: project.demoUrl ?? "",
          repoUrl: project.repoUrl ?? "",
          tags,
          featured: project.featured,
          order: project.order,
        }}
      />
    </div>
  );
}
