import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Project</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Add a project to your showcase
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
