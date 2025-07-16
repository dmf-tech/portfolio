const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const { file } = event.queryStringParameters;
    
    // An allowlist of files to prevent arbitrary file access
    const allowedFiles = ['resume.json', 'projects.json', 'blogs.json'];

    if (!file || !allowedFiles.includes(file)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid file requested.' })
        };
    }

    try {
        // Construct the path to the file in the project's root directory
        const filePath = path.resolve(process.cwd(), file);
        const data = fs.readFileSync(filePath, 'utf8');
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: data
        };
    } catch (error) {
        console.error(`Error reading file: ${file}`, error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Could not read file: ${file}` })
        };
    }
}; 