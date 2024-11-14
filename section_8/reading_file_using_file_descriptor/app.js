import fs from "node:fs"
import { connect } from "node:http2";

const fd1 = fs.openSync("file.txt","w");
console.log(fd1)
const buf = Buffer.alloc(10)

fs.read(fd1,{buffer:buf},(err,bytesread,bufferData)=>{
 console.log(bytesread)
 console.log(bufferData)
})