import fs from 'node:fs/promises';

//it is equivaltent to btoa in browser
// const a = await fs.readFile('pic.jpg', 'base64')
// // console.log(a)
// fs.writeFile('new-pic.txt', a)
//it is equivaltent to atob in browser
// fs.writeFile('new-file.txt', a, 'base64')



/**recovering image from base64 string */

const str = await fs.readFile('new-pic.txt', 'utf-8')
console.log(str)

// const img = str.toString('utf-8')
fs.writeFile('new-pic.jpg', str, 'base64')