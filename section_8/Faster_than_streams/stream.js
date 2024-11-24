// import React from 'react';
import fs, { write } from "node:fs";

export default function createWritableStm(path) {
    
    const buff = Buffer.allocUnsafe(4);
    console.time()
    let fd = fs.openSync(path,"w");
    let bytesWritten = 0;
    let remainingStr = '';
    for(let i=1;i<=10;i++){
        // fs.writeSync(fd,i + ",")
        // if(bytesWritten % 64 ){

        /**returns currently written byte not total byte */

        let str = `${i}, `;
        //we did this instead of using write(remainingStr + str, byteswritteen) because extra space was excluded duing third loop
        str = remainingStr + str;

        let byte = buff.write( str,bytesWritten);
        bytesWritten = bytesWritten + byte;
        if(buff.byteLength == bytesWritten){
            console.log(bytesWritten)           
            fs.writeSync(fd,buff)
                remainingStr='';
            bytesWritten = 0;
        }
        // console.log(byte)
        if(str.length > byte){
             remainingStr = str.slice(byte);
            // fs.writeSync(fd,remainingStr)
        }
        // }


    }
    fs.writeSync(fd,remainingStr)
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