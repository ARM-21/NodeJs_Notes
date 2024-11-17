// import React from 'react';
import fs from "node:fs";

export default function createWritableStm(path) {
    const buff = Buffer.allocUnsafe(64 * 1024);
    console.time()
    let fd = fs.openSync(path,"w");
    for(let i=0;i<5000;i++){
        // fs.writeSync(fd,i + ",")

        buff.write(`${i}`)
    }
    fs.closeSync(fd)
    console.log(buff)
    fs.closeSync(fd)
    console.timeEnd()

}
createWritableStm("file2.txt")

// const buff = Buffer.alloc(10);
// buff[0] = 1;
// console.log(buff.byteLength)