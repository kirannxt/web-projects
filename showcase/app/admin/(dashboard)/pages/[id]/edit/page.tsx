import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageForm from "@/components/PageForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });

  if (!page) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Page</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Update &ldquo;{page.title}&rdquo;
        </p>
      </div>
      <PageForm
        initialData={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          content: page.content,
          parentMenu: page.parentMenu,
          order: page.order,
          published: page.published,
        }}
      />
    </div>
  );
}
