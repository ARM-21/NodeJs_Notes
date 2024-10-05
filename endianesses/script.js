import fs from "node:fs/promises"

const buffer = await fs.readFile('file.txt');

console.log(buffer.toString('utf16le'))