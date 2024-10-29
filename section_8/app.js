import fs from "node:fs/promises"
import fsForStreams from "node:fs"


/**reading and writing using buffer impacts the performance of an application */
// const buffer = await fs.readFile('vid.mp4')

// // console.log(buffer.toString())
// console.log(buffer.byteLength)


/////////////////////////////////////////////////////////////////

const bufferStream = fsForStreams.createReadStream('vid.mp4');
// console.log("buffer stream",bufferStream)

bufferStream.on('data',(chunkBuffer)=>{
    console.log(chunkBuffer)
})