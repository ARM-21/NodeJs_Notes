import fs from "node:fs";

// const fd = fs.openSync("file.txt","w");

// fs.write(fd,"manoj",(err,written,str)=>{
// console.log(str)
// console.log(written)
// console.log(err)
// })
import createWritableStm from "./stream.js"
createWritableStm("file2.txt")