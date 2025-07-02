const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputDir = path.join(__dirname, "../outputs");

const executePython = async (filePath, input = "") => {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const jobId = path.basename(filePath).split(".")[0];
    const inputPath = path.join(outputDir, `${jobId}.txt`);
    fs.writeFileSync(inputPath, input);

    return new Promise((resolve, reject) => {
        exec(
            `python3 ${filePath} < ${inputPath}`,
            { timeout: 3000 },
            (error, stdout, stderr) => {
                if (error) {
                    if (error.killed) {
                        return reject({ type: "TLE", message: "Time Limit Exceeded" });
                    }
                    return reject({
                        type: "RuntimeError",
                        message: stderr || error.message,
                    });
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = executePython;
