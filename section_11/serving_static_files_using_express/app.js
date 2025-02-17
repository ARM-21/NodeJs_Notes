import express from "express";
import { createReadStream } from "fs";
import fs, { open } from "fs/promises"
const port = 4000;

const app = express();

app.use(express.static('./files'));


app.get('/',(req,res)=>{
    res.end('home page')
})
app.get('/test',async (req,res)=>{
    // const file = await open('vid.mp4')
    // const readStream = file.createReadStream()
    // const { size } = await file.stat()
    
    // res.setHeader('content-length',size)
    // // res.writeHead(206,'partial content')
    // res.status(206)
    // res.setHeader('content-type','video/mp4')
    // res.setHeader('accept-range','bytes')
    // res.setHeader('content-range',`bytes ${readStream.readable}- ${size}`)
    // readStream.pipe(res)
    res.sendFile(`${process.cwd()}/vid.mp4`)    
})

app.listen(port,()=>{
    console.log('server is listening at port '+ port)
})
console.log(process.cwd())