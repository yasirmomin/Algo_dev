import { Link, useLocation } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

export default function HeaderNavigation({ problemId }) {
  const location = useLocation();

  const isActive = (targetPath) => {
  const currentPath = location.pathname;
  if (targetPath === problemId) return !currentPath.includes("solutions") && !currentPath.includes("submissions");
  return currentPath.includes(targetPath);
};

  return (
    <div className="flex items-center bg-black/20 border shadow-black shadow-2xs rounded-lg py-2 px-4 justify-between border-b pb-2 mb-4
    dark:bg-gray-800 dark:border-gray-700  dark:shadow-white dark:shadow-2xs">
      <Link
        to="/problems"
        className="flex items-center text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white"
      >
        <HiArrowLeft className="mr-1" />
        <span className="text-md">Problem List</span>
      </Link>

      <div className="flex space-x-4">
        <Link
          to={`/problems/${problemId}`}
          className={`text-md border-b-2 ${
            isActive(problemId) ? "border-blue-500 text-black dark:text-white" : "border-transparent text-gray-700 dark:text-gray-200"
          } hover:text-black dark:hover:text-white`}
        >
          Description
        </Link>

        <Link
          to={`/problems/${problemId}/solutions`}
          className={`text-md border-b-2 ${
            isActive("solutions") ? "border-blue-500 text-black dark:text-white" : "border-transparent text-gray-700 dark:text-gray-200"
          } hover:text-black dark:hover:text-white`}
        >
          Solutions
        </Link>

        <Link
          to={`/problems/${problemId}/submissions`}
          className={`text-md border-b-2 ${
            isActive("submissions") ? "border-blue-500 text-black dark:text-white" : "border-transparent text-gray-700 dark:text-gray-200"
          } hover:text-black dark:hover:text-white`}
        >
          Submissions
        </Link>
      </div>
    </div>
  );
}
