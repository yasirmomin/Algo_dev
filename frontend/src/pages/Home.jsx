import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen grid">
      <div className=" flex items-center justify-center bg-gradient-to-br from-white via-indigo-50 to-blue-50 dark:from-[#1e1b4b] dark:to-[#0f0c29] px-6">
        <div className="max-w-3xl w-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8 md:p-12 text-center transition">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 drop-shadow-md mb-4">
            🚀 Welcome to the Online Judge
          </h1>

          <p className="text-lg text-gray-700 dark:text-white-400 mb-8">
            Solve, Compete, and Sharpen your coding skills with challenges and contests.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/problems"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow transition"
            >
              🔍 View Problems
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg shadow transition"
            >
              🧑‍💻 My Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;