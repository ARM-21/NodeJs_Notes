import fs from "node:fs/promises"
import fsForStreams from "node:fs"


/**reading and writing using buffer impacts the performance of an application */
// const buffer = await fs.readFile('vid.mp4')

// // console.log(buffer.toString())
// console.log(buffer.byteLength)


/////////////////////////////////////////////////////////////////
console.time()

const bufferStream =  fsForStreams.createReadStream('/home/arm-21/Videos/vid.mp4',{highWaterMark:100 * 1024 * 1024});
// // console.log("buffer stream",bufferStream)
let count =0;
bufferStream.on('data',(chunkBuffer)=>{
   
    

    // if(count == 0){
    //     fs.writeFile('vid.mp4',chunkBuffer + '\n')
    // }
    // else{
    fs.appendFile('vid.mp4',chunkBuffer)
// }
    console.log((count/3)*100+" %")
    count++;
    console.log((count/3)*100+" %")
//    console.log(chunkBuffer)
   
})
bufferStream.on('end',(chunk)=>{
    console.timeEnd();
    console.log(count)
})

// bufferStream.on('error',(err)=>{
// console.log("error ocuured while reading file",err)
// })

// const buff = await fs.readFile('file.txt');

// console.log(buff)