const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executeJava = async (filePath, input = "") => {
  const dir = path.dirname(filePath);
  const inputPath = path.join(dir, "input.txt");

  fs.writeFileSync(inputPath, input);

  return new Promise((resolve, reject) => {
    // Compile
    exec(`javac Main.java`, { cwd: dir }, (compileError, _, compileStderr) => {
      if (compileError) {
        return reject({ type: "CompileError", message: compileStderr });
      }
      // Run
      exec(`java Main < input.txt`, { cwd: dir, timeout: 3000 },
        (runError, stdout, stderr) => {
          if (runError) {
            if (runError.killed) {
              return reject({ type: "TLE", message: "Time Limit Exceeded" });
            }
            return reject({ type: "RuntimeError", message: stderr || runError.message });
          }
          resolve(stdout);
        }
      );
    });
  });
};

module.exports = executeJava;
