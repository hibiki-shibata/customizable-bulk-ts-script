import fs from 'node:fs' // or const fs = require('fs'); // if using CommonJS

export function readFileContent(relativeFilePath: string): string {
    if (!fs.existsSync(relativeFilePath)) throw new Error(`❌File not found: ${relativeFilePath}`);
    const rawData: string = fs.readFileSync(relativeFilePath, 'utf8')
    return rawData
}

