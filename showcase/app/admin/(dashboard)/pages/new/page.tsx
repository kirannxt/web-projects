import PageForm from "@/components/PageForm";

export default function NewPagePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Page</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Create a new page to add to the site navigation submenu
        </p>
      </div>
      <PageForm />
    </div>
  );
}
