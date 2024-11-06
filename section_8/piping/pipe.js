import fs from "node:fs"


const readBuffer = fs.createReadStream("/home/arm-21/Videos/vid.mp4",{highWaterMark: 50*1024*1024});
const writeBuffer = fs.createWriteStream("exampleWrite.mp4",{highWaterMark: 50*1024*1024});

// readBuffer.on('data',(chunk)=>{
//     const backpressure =writeBuffer.write(chunk);
//     if(!backpressure){
//         console.log("backpressure")
//         readBuffer.pause()
//     }
// }
// )

// writeBuffer.on('drain',()=>{
//     console.log("drained")
//     readBuffer.resume()
// }   )

/**all of the above code is replaced by just a single method called pipe. */
/**note: pipe method doesn't provide a mechanism to handle errors */

readBuffer.pipe(writeBuffer)
setTimeout(()=>{
    readBuffer.destroy('app has been destroyed')
},100)


/**pipe and unpipe event is fired on write stream */

//with pipe method we can also handle error as below
readBuffer.on('error',(err)=>{ console.log(err)})