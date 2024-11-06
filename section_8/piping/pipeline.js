import fs from "node:fs";
import {pipeline} from "node:stream";


const readBuffer = fs.createReadStream("/home/arm-21/Videos/vid.mp4",{highWaterMark: 50*1024*1024});
const writeBuffer = fs.createWriteStream("exampleWrite.mp4",{highWaterMark: 50*1024*1024});

pipeline(readBuffer,writeBuffer,(err)=>{
    console.log("err has been sucessfully handled")
})