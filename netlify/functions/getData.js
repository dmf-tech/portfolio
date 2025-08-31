const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    const { file } = event.queryStringParameters || {};

    const allowedFiles = ['resume.json', 'projects.json'];

    if (!file || !allowedFiles.includes(file)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid file requested.' })
        };
    }

    try {
        const basePath = process.cwd();
        const filePath = path.join(basePath, file);
        
        if (!filePath.startsWith(basePath)) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Invalid file path.' })
            };
        }

        const fileExtension = path.extname(file).toLowerCase();
        if (fileExtension !== '.json') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid file type.' })
            };
        }

        const stats = fs.statSync(filePath);
        const MAX_SIZE = 1024 * 1024; // 1 MB

        if (stats.size > MAX_SIZE) {
            return {
                statusCode: 413,
                body: JSON.stringify({ error: 'File too large.' })
            };
        }

        const data = fs.readFileSync(filePath, 'utf8');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'Cache-Control': 'no-store',
                'X-Content-Type-Options': 'nosniff',
                'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
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
