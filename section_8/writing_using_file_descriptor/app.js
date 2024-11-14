import fs from "node:fs";

const fd = fs.openSync("file.txt","w")

// fs.read(fd,(err,data,dataa)=>{
//     console.log(data)
//     console.log(dataa)
// })
const buff = Buffer.from("manoj")

fs.write(fd,buff,(err,b,su)=>{
console.log(err)
console.log(su)
})