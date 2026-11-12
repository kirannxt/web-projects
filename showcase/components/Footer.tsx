export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-lg w-7 h-7 flex items-center justify-center text-xs font-bold">
              PS
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              Project Showcase
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Project Showcase. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
