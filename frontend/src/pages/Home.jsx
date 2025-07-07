import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";


export default function Home() {
  return (
    <div className="dark:bg-[#000000] transition-colors duration-300">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-[url('/src/assets/light.png')] dark:bg-[url('/src/assets/dark.jpg')]"
      style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}>
        <div
          className=" p-8 md:p-12 text-center transition-all duration-500"
          
        >

          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent from-[#9c4bff] to-[#04b5a4] drop-shadow-md mb-6">
            🚀 Welcome to the Online Judge
          </h1>
          <p className="text-lg text-[#746e6e] mb-8">
            Solve, compete, and sharpen your coding skills with real-world challenges.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/problems"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow transition"
            >
              🔍 View Problems
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#121212]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-[#E1E1E1] mb-4">
              Everything you need to become a better programmer
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💻",
                title: "Real Coding Problems",
                description:
                  "Access curated problems with real-world applications and varying difficulty.",
              },
              {
                icon: "⚡",
                title: "Instant Feedback",
                description:
                  "Get detailed execution results and performance metrics immediately.",
              },
              {
                icon: "🏆",
                title: "Timed Contests",
                description:
                  "Participate in regular competitions with leaderboards and rewards.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-[#2D2D2D] p-8 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-[#E1E1E1] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-white font-bold text-xl mb-2">Online Judge</h2>
            <p className="text-[#E1E1E1]">
              A modern online judge platform by Yasir to empower developers.
            </p>
          </div>

          <div>
            <h2 className="text-white font-bold text-lg mb-2">Quick Links</h2>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="hover:text-[#BB86FC]">Home</Link>
              </li>
              <li>
                <Link to="/contests" className="hover:text-[#BB86FC]">Contests</Link>
              </li>
              <li>
                <Link to="/problems" className="hover:text-[#BB86FC]">Problems</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-bold text-lg mb-2">Connect</h2>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#BB86FC] text-xl"><FaFacebook /></a>
              <a href="#" className="hover:text-[#BB86FC] text-xl"><FaTwitter /></a>
              <a href="#" className="hover:text-[#BB86FC] text-xl"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © 2025 OnlineJudge Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
