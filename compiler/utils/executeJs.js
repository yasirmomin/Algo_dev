const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executeJs = async (filePath, input = "") => {
  const dir = path.dirname(filePath);
  const inputPath = path.join(dir, "input.txt");

  fs.writeFileSync(inputPath, input);

  return new Promise((resolve, reject) => {
    exec(`node main.js < input.txt`, { cwd: dir, timeout: 3000 },
      (error, stdout, stderr) => {
        if (error) {
          if (error.killed) {
            return reject({ type: "TLE", message: "Time Limit Exceeded" });
          }
          return reject({ type: "RuntimeError", message: stderr || error.message });
        }
        resolve(stdout);
      }
    );
  });
};

module.exports = executeJs;
