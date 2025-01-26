import fsPromises,{ open, readdir, readFile } from "node:fs/promises";
import http from "node:http";
import mime, { contentType } from 'mime-types';
import fs, { createWriteStream } from "node:fs";
import {fileTypeFromBuffer, fileTypeFromStream} from "file-type"
// console.log(fileType)
//server create
const server = http.createServer(async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','*')
    //read index file as buffer and server it
    if(req.url == '/'){
        readStorage(res)
        return
    }
     // serve favicon file if request is made to /favicon.ico
    else if(req.url == '/favicon.ico'){
        const buffer = await readFile('alert.png');
        res.end(buffer);
        return
    }
//handle other requests
    handleRequest(req,res)

   
   
})



async function handleRequest(req,res){
    //split the url section in to queryparams and main url section
    const userReq = req.url.split('?')
    const action = userReq[1].split('=')
    //decode the URI component % to spaces we 
    const openURL =decodeURIComponent(userReq[0]);

    const filename = userReq[0].slice(userReq[0].lastIndexOf('/')+1);
    const filetype = mime.contentType(filename)

    console.log(req.method)
    //upload
    if(req.method.toLowerCase() == 'post'){
        handleUpload(req,res)
        return
    }
    const fd = await open(`.${openURL}`)
    const stat = (await fd.stat())

    if(action[1] == 'delete'){
        const isDirectory = stat.isDirectory()
        handleDelete(isDirectory,openURL)
        res.end('delete sucessfully')
        return
    }
// if a request is a directory
    if(stat.isDirectory()){
        console.log('isdirectory')
        readStorage(res,userReq[0])
        return
    }
    res.setHeader('Content-Length',stat.size)
    res.setHeader('Content-Type',filetype)
    const readStream = fd.createReadStream();

    //download
    if(action[1] == 'download'){
        res.setHeader('Content-Disposition',`attachment; filename=${filename};`)
        readStream.pipe(res)
      
    }
    else{
        readStream.pipe(res)
    }
    readStream.on('close',()=>{
        fd.close()
    })

}
//handles delete
async function handleDelete(isDirectory,openURL) {
    if(isDirectory){
        fsPromises.rmdir(`.${openURL}`, { recursive: true, force: true })
    }
    fsPromises.rm(`.${openURL}`)
    return
}

//handles the user uploaded resources
async function handleUpload(req,res) {
    const stream = createWriteStream(`./storage/${req.headers.filename}`)
   req.pipe(stream)
    
req.on('end',()=>{console.log('uploaded')})
    req.on('close',()=>{
        res.end('uploaded sucessfully')
    })
    
}



//read intial files from storage folder
async function readStorage(res,dir){
    const userResources = await readdir(`.${dir?dir:'/storage'}`)
    // console.log(userResources)
    
    res.end(JSON.stringify(userResources))
}

server.listen(4000,'192.168.100.7',()=>{
    console.log('server started')
})

server.on('error',()=>{
    console.log('error occured at server')
})