// import React from 'react';
import fs, { write } from "node:fs";

export default function createWritableStm(path) {
    
    const buff = Buffer.allocUnsafe(4);
    console.time()
    let fd = fs.openSync(path,"w");
    let bytesWritten = 0;
    for(let i=0;i<10;i++){
        // fs.writeSync(fd,i + ",")
        // if(bytesWritten % 64 ){

        /**returns currently written byte not total byte */

        let byte = buff.write(`${i}, `,bytesWritten)
        bytesWritten = bytesWritten + byte;
        if(buff.byteLength == bytesWritten){
            console.log(bytesWritten)
            fs.writeSync(fd,buff)
            bytesWritten = 0;
        }
            // console.log(byte)
        // }


    }
    console.log(bytesWritten)
    // fs.closeSync(fd)
    // console.log(buff)
    fs.closeSync(fd)
    console.timeEnd()

}
createWritableStm("file2.txt")

// const buff = Buffer.alloc(10);
// buff[0] = 1;
// console.log(buff.byteLength)