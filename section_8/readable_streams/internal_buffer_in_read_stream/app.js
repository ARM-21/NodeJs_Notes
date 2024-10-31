import fs from "node:fs"

const readStream = fs.createReadStream("./../chars.txt",{highWaterMark:4,encoding:'utf-8'})

// readStream.setEncoding('utf-8')

//destroy()

readStream.on('close',()=>{
    console.log('closed')
})
readStream.on('end',()=>{
    console.log('closed')
})

readStream.on('readable',()=>{
    // console.log(readStream.readableLength)
    console.log(readStream.read())
    readStream.destroy()

    // console.log(readStream.readableLength)
})
// readStream.read()


//important methods for read stream
/**
 * 1.on()
 * 2/setEncoding()-> to set particular encoding
 * 3.destroy() -> to destroy the stream
 *4. events:_ readble,data,end.,close ,error */