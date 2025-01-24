import { open, readdir, readFile } from "node:fs/promises";
import http from "node:http";
import mime from 'mime-types'
const requestURL = []
let count = 0;

//server create
const server = http.createServer(async (req,res)=>{
    
    if(req.url == '/'){
        //read index file as buffer and server it
        userInterface(res)
    }
    // serve favicon file if request is made to /favicon.ico
    else if(req.url == '/favicon.ico'){
        try{
            //read alert.png as stream and serve it
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
    //serve script.js file for both in index.html initially and for a another directory when opened
    else if(req.url.match(/\/script\.js/)){
        try{
            const fd = await open('./script.js')
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
    else if(req.method.toLocaleLowerCase() != 'post'){
        console.log(req.url)
        const userURL = req.url.split('?');
        console.log(userURL)
        const userAction = userURL[1].split('=')[1];
   
    
   //request to / url
        requestURL.push(req.url)
        count++;
    
        try{
            
            const fd = await open(`.${decodeURIComponent(userURL[0])}`)
            //if a selected url is a directory  
            handleAction(userAction,res,(await fd.stat()).size,mime.contentType(userURL[0].slice(userURL[0].lastIndexOf('/') + 1)), userURL[0].slice(userURL[0].lastIndexOf('/')+1))
            if((await fd.stat()).isDirectory()){
                userInterface(res,'.'+userURL[0])
                return
            }
            // else{
                const stream = fd.createReadStream();
            stream.pipe(res)
            stream.on('error',()=>{
                console.log('error occured at readable stream')
            })
            stream.on('close',()=>{
                fd.close()
            })
            // }
            
        }catch(err){
            
            res.end('file not found!')
        }
        // console.log(req.url)

    }
    res.on('error',()=>{
        console.log('error occured at res stream')
    })
    req.on('data',async (chnk)=>{
        const filename = chnk.toString('utf-8').match(/filename="([^"]*)"/)
        // console.log(filename)   
        // const fd = await open(`./storage/vid.txt`,'w')
        // const fd = await open(`./storage/${requestURL[count-1]?requestURL[count-1]:''}/${filename}`,'w')
        // const writeStream = fd.createWriteStream()
        // writeStream.write(chnk)
        // writeStream.on('close',()=>{
        //     fd.close()
        // })
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
                    // console.log(path)
        filesDynamic += `<li> ${filename} </li>
         <a href='/storage/${images?'images/':''}${path}?action=open'>
        <button>Preview</button>
        </a>
         <a href='/storage/${images?'images/':''}${path}?action=download'>
             <button>Download</button>
        </a>
        `;
    })
    return filesDynamic;
}


async function userInterface(res,url='./storage'){
    const boilerPlate = await readFile('./userInterface/index.html','utf-8')
       
          //initially read the files content inside storage folder
            const readFIle = await readdir(url,{encoding:'utf-8'})
            let filesDynamic = readInsideFolder(readFIle , url != './storage')
            //send index.html with listed files name ins storage folder
            res.end(boilerPlate.replace("${filesDynamic}",filesDynamic))
}

async function handleAction(action,res,size,fileType, filename){

    res.setHeader('Content-Length',size)
    res.setHeader('Content-Type',fileType)
    if(action == 'download'){
        res.writeHead(200,'ok',{"content-disposition":`attachment; filename=${filename} `,'content-type':fileType})
    }
    
}