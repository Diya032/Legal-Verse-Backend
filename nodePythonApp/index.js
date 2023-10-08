const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const inputdataPath = path.join(__dirname, 'legal_NER', 'data_to_process.txt');
    var inputdata = fs.readFileSync(inputdataPath, 'utf-8');
    const pythonScriptPath = path.join(__dirname, 'legal_NER', 'Highlighter.py');

    const python = spawn('python', [pythonScriptPath, inputdata, 'second_data']);
    
    let htmlContent = '';
    let pythonError = ''; // Variable to capture Python script error messages

    python.on('error', (error) => {
        console.error(`Error in Python script: ${error.message}`);
    });

    python.stdout.on('data', (data) => {
        // Capture the data and convert it to a string
        htmlContent += data.toString();
    });

    python.stderr.on('data', (data) => {
        // Capture Python script error messages
        pythonError += data.toString();
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);

        // Log the HTML content
        console.log(htmlContent);

        // Send the captured HTML content to the client
        res.send(htmlContent);

        // Log Python script error messages (if any)
        if (pythonError) {
            console.error(`Python script error: ${pythonError}`);
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
