const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
const generateFile = require('./utils/generateFile');
const executeCpp = require('./utils/executeCpp');
const executePython = require('./utils/executePython');
const executeJava = require('./utils/executeJava');
const executeJs = require('./utils/executeJs');
app.use(cors({ credentials: true, }));
const isAuthenticated = require('./middlewares/isAuthenticated');
const dotenv = require('dotenv');
dotenv.config();
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/run', isAuthenticated, async (req, res) => {
    const { language = "cpp", code, input="" } = req.body;
    if (code == undefined) {
        return res.status(400).json({
            success: false,
            error: 'Code is required'
        });
    }
    try {
        const filePath = generateFile(language, code);

        let output = "";

        if (language === "cpp") {
            output = await executeCpp(filePath, input);
        } else if (language === "java") {
            output = await executeJava(filePath, input);
        } else if (language === "python") {
            output = await executePython(filePath, input);
        }
        else if( language === "javascript") {
            output = await executeJs(filePath, input); 
        }
        res.json({
            success: true,
            filePath,
            output: output
        });
    } catch (err) {
        let errorMessage = "";
        if (err.type === "TLE") {
            errorMessage = "Time Limit Exceeded!";
        } else if (err.type === "CompileError") {
            errorMessage = "Compilation Error!\n"+ err.message ;
        } else if (err.type === "RuntimeError") {
            errorMessage = "Runtime Error!\n"+ err.message ;
        } else {
            errorMessage = err.message || "Unknown Error";
        }

        return res.status(400).json({
            success: false,
            error: errorMessage
        });

    }
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

