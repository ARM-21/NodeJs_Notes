import { open, readFile } from "node:fs/promises";
import http from "node:http";

const server = http.createServer( async (req,res)=>{
    // const data = await getFile(req.url)
    try{
        const fd = await  open("."+req.url)
        const readableStream = fd.createReadStream();
        readableStream.pipe(res)
        readableStream.on('error',(err)=>{
            console.log("stream error occured")
        })
        // res.end(readableStream)
    }catch(err){
        console.log("error occured while opening file")
    }
   
    
  
    
    // res.end(data)
})

server.listen(3000,'192.168.100.7',()=>{
    console.log('server is listening')
})
async function getFile(filePath){
    const file  = await readFile(filePath);
    return file.toString()
    
}