import fs, { writeFileSync } from "node:fs"


const stream = fs.createReadStream('chars.txt',{highWaterMark:4})
// let count =0;

stream.on('data',(chnk)=>{
    /**alternative way */
    if(stream.bytesRead == stream.readableHighWaterMark){
        fs.writeFileSync('charFromStrm.txt',chnk)
    }
    else{
    fs.appendFileSync('charFromStrm.txt',chnk)

    }
//    if(count == 0){
//     fs.writeFileSync('charFromStrm.txt',chnk)
//    }
//    else{
//     fs.appendFileSync('charFromStrm.txt',chnk)
//    }
//    count++;
stream.pause()
setTimeout(()=>{
    stream.resume()
},1000)
console.log(stream.isPaused())
})

// console.log(stream.readableFlowing)
// console.log(stream.readableEnded)
// console.log(stream.isPaused())

/**
 * initial
 * readableFLowing:null
 * readbleEnded:false
 * paused:false
 * 
 * 
 * flowing
 * reableflowing:true
 * readbleended:false
 * paused:false
 * 
 * paused
 * readableFlowing:false
 * readableEnded:false
 * paused:true
 * 
 * ended
 * readableEnded:true,
 * paused:false
 * readbleFlow:true
 */