const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const submissionsDir = path.join(__dirname, "../codes");

const generateFile = (language, code) => {
  // Ensure /codes exists
  if (!fs.existsSync(submissionsDir)) {
    fs.mkdirSync(submissionsDir, { recursive: true });
  }

  // Create a unique folder for this submission
  const jobId = uuid();
  const jobDir = path.join(submissionsDir, jobId);
  fs.mkdirSync(jobDir);

  // Determine filename
  let fileName;
  if (language === "cpp") fileName = "main.cpp";
  else if (language === "java") fileName = "Main.java";
  else if (language === "python") fileName = "main.py";
  else if (language === "javascript") fileName = "main.js";
  else throw new Error("Unsupported language");

  const filePath = path.join(jobDir, fileName);
  fs.writeFileSync(filePath, code);

  return { filePath, jobId, jobDir };
};

module.exports = generateFile;
