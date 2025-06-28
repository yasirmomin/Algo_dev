const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, "../codes");

const generateFile = (language, code) => {
    if (!fs.existsSync(dirCodes)) {
        fs.mkdirSync(dirCodes, { recursive: true });
    }
    const jobId = uuid();
    let extension = "";
    if (language === "cpp") extension = "cpp";
    else if (language === "java") extension = "java";
    else if (language === "python") extension = "py";
    else if (language === "javascript") extension = "js";

    let fileName = "";
    if (language === "java") {
        fileName = `Main.java`;
    } else {
        const jobId = uuid();
        fileName = `${jobId}.${language}`;
    }
    const filePath = path.join(dirCodes, fileName);
    fs.writeFileSync(filePath, code);
    return filePath;
};

module.exports = generateFile;