import fs from "node:fs"
// const file = 
process.stdin.fd // 0
fs.open("file.txt",(err,fd)=>{
console.log(fd)
});

// console.log(file) // 3