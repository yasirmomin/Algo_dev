import { Link } from "react-router-dom";
function About() {
  return (
    <div className="dark:bg-[#0E0E0E] bg-white text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <section className="py-20 px-6 text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About the CodeJury</h1>
        <p className="text-lg max-w-3xl mx-auto">
          Empowering developers to solve, compete, and grow through real-world coding challenges.
        </p>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Why this platform exists</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          This Online Judge was created to provide a clean, powerful space for developers to practice
          coding problems, sharpen their algorithms, and get instant feedback—without distractions.
          Whether you're preparing for interviews or just passionate about problem-solving, this platform
          is built for you.
        </p>
      </section>

      <section className="py-16 px-6 bg-gray-200 dark:bg-[#1C1C1C]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Powered by Modern Technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-lg">
            <div>⚛️ React</div>
            <div>🌐 Express</div>
            <div>🛢️ MongoDB</div>
            <div>🐳 Docker</div>
            <div>🧠 AI Integration</div>
            <div>✨ Tailwind CSS</div>
            <div>🔐 JWT Auth</div>
            <div>🚀 Node.js</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Meet the Creator</h2>
        <p className="text-lg mb-4 text-gray-600 dark:text-gray-400">
          👋 Hi, I'm <span className="font-semibold text-indigo-500">Yasir</span> — a passionate developer who
          believes in building tools that help others grow. This judge platform started as a project to
          combine my love for coding and teaching into one powerful app.
        </p>
        <p className="text-md text-gray-500 dark:text-gray-400 italic">Let’s build something amazing together!</p>
      </section>

      <section className="py-16 px-6 bg-gray-200 dark:bg-[#1C1C1C]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">What's Next?</h2>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
            We're just getting started! Here’s what’s planned for future updates:
          </p>
          <ul className="text-left md:text-center space-y-2 text-gray-700 dark:text-gray-300">
            <li>🏆 Timed Contests with Leaderboards</li>
            <li>📈 Performance Analytics</li>
            <li>📖 Editorials and Solution Discussions</li>
            <li>🎨 Customizable Themes & Profiles</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to dive in?</h2>
        <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
          Head over to the problems section and start solving today!
        </p>
        <Link
          to="/problems"
          className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow hover:from-indigo-600 hover:to-purple-600 transition"
        >
          🚀 Go to Problems
        </Link>
      </section>
    </div>
  );
}

export default About;
