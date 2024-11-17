import fs from "node:fs"
import { connect } from "node:http2";

const fd1 = fs.openSync("file.txt","w");
console.log(fd1)


//to create a custom buffer of custom size
const buf = Buffer.alloc(10)

///to create a buffer of default size
//dont need to use {buffer:buf} in this case defuault size will of 64kb

fs.read(fd1,{buffer:buf},(err,bytesread,bufferData)=>{
 console.log(bytesread)
 console.log(bufferData)
})