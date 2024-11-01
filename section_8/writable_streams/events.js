import fs from "node:fs"

const read = fs.createReadStream('file.txt',{highWaterMark:2});

// read.on('data',(chnk)=>{

    // console.log(read.readableLength)
    // console.log(read.readableLength)
// })

// read.on('readable',()=>{
//     console.log(read.readableLength)
//     read.read(4);

// })


// read.on("close",()=>{
//     console.log('closed')
// })
// read.on("end",()=>{
//     console.log('ended')
// })



//writable streams----------->

const write = fs.createWriteStream("writeFile.txt",{highWaterMark:2});

read.on('data',(chnk)=>{
    let isEmpty = write.write(chnk);
    console.log(isEmpty)
   if(!isEmpty){
    read.pause();
   }
   console.log(write.writableLength)
})

// read.on('readable',()=>{
//     read.resume()
// })

read.on('close',()=>{
    write.end()
})
write.on('finish',()=>{
    console.log("finished")
})

write.on('drain',()=>{
    read.resume()
})