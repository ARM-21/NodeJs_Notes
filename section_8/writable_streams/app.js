import fs from "node:fs";

//default value of highwatermark is 16kiB
console.time()
const bufferStream =  fs.createReadStream('/home/arm-21/Videos/vid.mp4',{highWaterMark:1 * 1024 * 1024});

const writeStream = fs.createWriteStream('fileWrite.mp4')
bufferStream.on('data',(chnk)=>{
    //using sync 300ms
    fs.appendFileSync('syncFile.mp4',chnk)

    //using stream 215ms
    // writeStream.write(chnk)

    /**after handling backpressure  :836ms*/

    let isEmpty = writeStream.write(chnk)
    if(!isEmpty){
        bufferStream.pause()
    }
})
writeStream.on('drain',()=>{
    bufferStream.resume()
})

bufferStream.on('end',()=>{
console.timeEnd()
})