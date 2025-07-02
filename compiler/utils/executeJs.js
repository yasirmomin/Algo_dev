const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputDir = path.join(__dirname, "../outputs");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const executeJs = async (filePath, input = "") => {
    const jobId = path.basename(filePath).split(".")[0];
    const inputFilePath = path.join(outputDir, `${jobId}.txt`);
    fs.writeFileSync(inputFilePath, input);

    return new Promise((resolve, reject) => {
        exec(`node ${filePath}`, { timeout: 3000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    return reject({ type: "TLE", message: "Time Limit Exceeded" });
                }
                return reject({
                    type: "RuntimeError",
                    message: stderr || error.message,
                });
            }
            if (stderr) {
                return reject({ type: "RuntimeError", message: stderr });
            }
            return resolve(stdout);
        });
    });
};

module.exports = executeJs;
