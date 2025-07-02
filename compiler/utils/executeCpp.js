const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { rejects } = require('assert');
const outputDir = path.join(__dirname, '../outputs');
const inputDir = path.join(__dirname, '../inputs');

const executeCpp = async (filePath, input = "") => {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(inputDir)) {
        fs.mkdirSync(inputDir, { recursive: true });
    }
    const jobId = path.basename(filePath).split('.')[0];
    const outputFilename = `${jobId}.out`;
    const outputPath = path.join(outputDir, `${outputFilename}`);
    const inputPath = path.join(inputDir, `${jobId}.txt`);

    fs.writeFileSync(inputPath, input);
    return new Promise((resolve, reject) => {
        // Compile first
        exec(`g++ ${filePath} -o ${outputPath}`, (compileError, _ , compileStderr) => {
            if (compileError) {
                return reject({ type: "CompileError", message: compileStderr });
            }
            exec(
                `${outputPath} < ${inputPath}`,
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
                    return resolve(runStdout);
                }
            );
        });
    });

};

module.exports = executeCpp;

