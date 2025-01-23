import { open, readdir, readFile } from "node:fs/promises";
import http from "node:http";
import process from "node:process";

const server = http.createServer(async (req,res)=>{
    const processNode = process;
   
    if(req.url == '/'){
        const boilerPlate = await readFile('./userInterface/index.html','utf-8')
       
            // const stream = fd.createReadStream();
            const readFIle = await readdir('./storage',{encoding:'utf-8'})
            let filesDynamic = readInsideFolder(readFIle)
            
            res.end(boilerPlate.replace("${filesDynamic}",filesDynamic))
    }
    else if(req.url == '/favicon.ico'){
        try{
            const fd = await open('alert.png')
            const stream = fd.createReadStream();
            stream.pipe(res)
            stream.on('error',()=>{
                console.log('error occured at readable stream')
            })
        }catch(err){
            console.log('error occured while reading file')
            res.end('error occured while reading file')
        }
        
        
    }
    else{
        
        try{
            
            console.log('url',req.url)
            const fd = await open(`.${decodeURIComponent(req.url)}`)
            if((await fd.stat()).isDirectory()){
                const boilerPlate = await readFile('./userInterface/index.html','utf-8')
                const files = await readdir(`.${req.url}`)
               const filesDynamic = readInsideFolder(files,true )
                res.end(boilerPlate.replace("${filesDynamic}",filesDynamic))
            }
            const stream = fd.createReadStream();
            stream.pipe(res)
            stream.on('error',()=>{
                console.log('error occured at readable stream')
            })
        }catch(err){
            console.log('her','error occured while reading file')
            res.end('her','error occured while reading file')
        }
        console.log(req.url)

    }
    res.on('error',()=>{
        console.log('error occured at res stream')
    })

    req.on('data',(chnk)=>{
        console.log(chnk.toString())
    })
})

server.listen(4000,'192.168.100.7',()=>{
    console.log('server started')
})

server.on('error',()=>{
    console.log('error occured at server')
})

function readInsideFolder(lists,images){
    let filesDynamic = ''
    lists.forEach((filename)=>{
    
                    const path = encodeURIComponent(filename)
                    console.log(path)
        filesDynamic += `<li> <a href=./storage/${images?'images/':''}${path}>${filename}</a> </li>\n`;
    })
    return filesDynamic;
}