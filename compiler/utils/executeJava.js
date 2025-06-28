const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputDir = path.join(__dirname, "../outputs");

const executeJava = async (filePath, input = "") => {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const jobId = path.basename(filePath).split(".")[0];
    const dir = path.dirname(filePath);
    const inputPath = path.join(outputDir, `${jobId}.txt`);
    fs.writeFileSync(inputPath, input);

    const className = path.basename(filePath).replace(".java", "");

    return new Promise((resolve, reject) => {
        // Compile first
        exec(`javac ${filePath}`, (compileError, _, compileStderr) => {
            if (compileError) {
                return reject({ type: "CompileError", message: compileStderr });
            }
            // Run
            exec(
                `java -cp ${dir} ${className} < ${inputPath}`,
                { timeout: 3000 },
                (runError, runStdout, runStderr) => {
                    if (runError) {
                        if (runError.killed) {
                            return reject({ type: "TLE", message: "Time Limit Exceeded" });
                        }
                        return reject({
                            type: "RuntimeError",
                            message: runStderr || runError.message,
                        });
                    }
                    resolve(runStdout);
                }
            );
        });
    });
};

module.exports = executeJava;
