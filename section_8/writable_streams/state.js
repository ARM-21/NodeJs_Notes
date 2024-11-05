import fs from "node:fs"

const writeBuffer = fs.createWriteStream("exampleWrite.txt");

writeBuffer.write("hello")

//##initial state of write stream --> true if initial state is writable
console.log(writeBuffer.writable)
// writeBuffer.end()
console.log(writeBuffer.writable)


//##corked state  --> true if the stream is corked 
/**cork state is something when it is 1 ,we cannot write some content on hard disk.
 * we can only write over internal buffer
 */

writeBuffer.cork() //--> used to cork the write stream
console.log(writeBuffer.writableCorked)
writeBuffer.uncork() //--> used to uncork the write stream
console.log(writeBuffer.writableCorked)

//##end state --> true if the stream is ended
/**end state is end of a stream stream has been closed.*/ 
writeBuffer.end()
console.log(writeBuffer.writableEnded)
console.log(writeBuffer.writableLength) // 5 bytes pending to write

//##finished state --> true if the stream is finished
/**finished state is end of a stream stream has been closed and all data has been flushed to the underlying system.*/
writeBuffer.on('finish',()=>{
    
    console.log(writeBuffer.writableFinished)
    console.log(writeBuffer.writableLength)// 0 bytes pending to write
})