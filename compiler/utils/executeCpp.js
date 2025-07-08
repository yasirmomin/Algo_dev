const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const executeCpp = async (filePath, input = "") => {
  const dir = path.dirname(filePath);
  const outputPath = path.join(dir, 'program.out');
  const inputPath = path.join(dir, 'input.txt');

  fs.writeFileSync(inputPath, input);

  return new Promise((resolve, reject) => {
    // Compile
    exec(`g++ main.cpp -o program.out`, { cwd: dir }, (compileError, _, compileStderr) => {
      if (compileError) {
        return reject({ type: "CompileError", message: compileStderr });
      }
      // Run
      exec(`./program.out < input.txt`, { cwd: dir, timeout: 3000 },
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

module.exports = executeCpp;
