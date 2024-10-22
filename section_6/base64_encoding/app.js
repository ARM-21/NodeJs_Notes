import fs from 'node:fs/promises';

//it is equivaltent to btoa in browser
const a = await fs.readFile('file.txt', 'base64')
console.log(a)

//it is equivaltent to atob in browser
fs.writeFile('new-file.txt', a, 'base64')