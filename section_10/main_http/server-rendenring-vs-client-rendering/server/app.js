import { open, readdir, readFile } from "node:fs/promises";
import http from "node:http";
import mime from 'mime-types'
const requestURL = []
let count = 0;

//server create
const server = http.createServer(async (req,res)=>{
    
    if(req.url == '/'){
        //read index file as buffer and server it
        readStorage(res)
        return
    }
    else if(req.url == '/favicon.ico'){
        const buffer = await readFile('vite.svg');
        res.end(buffer);
        return
    }
    
    handleRequest(req,res)

    // serve favicon file if request is made to /favicon.ico
   
})



async function handleRequest(req,res){
    const userReq = req.url.split('?')
    const action = userReq[1].split('=')
    const openURL =decodeURIComponent(userReq[0]);

    const filename = userReq[0].slice(userReq[0].lastIndexOf('/')+1);
    console.log(filename)
    const filetype = mime.contentType(filename)
    console.log(filetype)
    
    const fd = await open(`.${openURL}`)
    const stat = (await fd.stat())

    if(stat.isDirectory()){
        readStorage(res,userReq[0])
        return
    }
    res.setHeader('Content-Length',stat.size)
    res.setHeader('Content-Type',filetype)
    const readStream = fd.createReadStream();
    console.log(action[1])
    if(action[1] == 'download'){
        res.setHeader('Content-Disposition',`attachment; filename=${filename};`)
        readStream.pipe(res)
      
    }
    else{
        readStream.pipe(res)
    }

}




async function readStorage(res,dir){
    const userResources = await readdir(`.${dir?dir:'/storage'}`)
    console.log(userResources)
    res.setHeader('Access-Control-Allow-Origin','*')
    res.end(JSON.stringify(userResources))
}

server.listen(4000,'192.168.100.7',()=>{
    console.log('server started')
})

server.on('error',()=>{
    console.log('error occured at server')
})