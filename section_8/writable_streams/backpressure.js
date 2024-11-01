/**Note:-
 * reading speed is faster than writing speed of harddisk as same as in real world.
 * writing is slow so read data from source is continiously store in buffer so there is a spike in cpu and memory
 * because of the backpressure of the data.
 * 
 * read -> buffer -> write(slow) 
 *writing takes time so buffer is filled with data and it is not able to write data to the file so it will store in buffer

 through backpressure we can control the flow of data from read to write

 * 
 */

 import fs from "node:fs";
import { connect } from "node:http2";

 const writeBuffer = fs.createWriteStream('file.txt',{highWaterMark:4});
 //4 byte of highwatermark value is used to determine the size of internal buffer
let i=0;

while(i<10){
    console.log(writeBuffer.writableLength)
   let isEmpty = writeBuffer.write('a')
    console.log(writeBuffer.writableLength)
    console.log(isEmpty)
    i++;
    if(!isEmpty){
        break;
    }
}

writeBuffer.on('drain',()=>{
    console.log("drain i",i)
    while(i<10){
        i++;
        console.log(writeBuffer.writableLength)
        let isEmpty = writeBuffer.write('a')
        console.log(writeBuffer.writableLength)
        if(!isEmpty){
            break;
        }
        console.log(isEmpty)
    }
})


