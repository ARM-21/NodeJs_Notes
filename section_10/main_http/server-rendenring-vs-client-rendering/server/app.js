import fsPromises, { open, readdir, readFile, rename } from "node:fs/promises";
import http from "node:http";
import mime, { contentType } from 'mime-types';
import fs, { createWriteStream } from "node:fs";
import { fileTypeFromBuffer, fileTypeFromStream } from "file-type"
// console.log(fileType)
//server create
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', 'DELETE,PATCH')

    //read index file as buffer and server it
    if (req.url == '/') {
        readStorage(res)
        return
    }
    // serve favicon file if request is made to /favicon.ico
    else if (req.url == '/favicon.ico') {
        const buffer = await readFile('alert.png');
        res.end(buffer);
        return
    }
    //handle other requests
    handleRequest(req, res)



})



async function handleRequest(req, res) {
    //split the url section in to queryparams and main url section
    const userReq = req.url.split('?')
    const action = userReq[1].split('=')
    //decode the URI component % to spaces we 
    const openURL = decodeURIComponent(userReq[0]);

    const filename = userReq[0].slice(userReq[0].lastIndexOf('/') + 1);
    const filetype = mime.contentType(filename)


    //upload
    if (req.method.toLowerCase() == 'post') {
        handleUpload(req, res)
        return

    }
   else if (req.method.toLowerCase() == 'patch') {
        let renameFile = req.headers.filename;
        //  req.on('data',(chnk)=>{
        //     renameFile = JSON.parse(chnk.toString())
        // console.log('data',JSON.parse(chnk.toString()))
        //     })
    // try{
        console.log(renameFile)
        res.setHeader('Content-Length','25')
        // res.end('File rename Successfull')
      
       handleRename(renameFile,openURL,req,res);
       return
    }

else{

    try {
        const fd = await open(`.${openURL}`)
        const stat = (await fd.stat())


        // if a request is a directory
        if (stat.isDirectory()) {
            console.log('isdirectory')
            readStorage(res, userReq[0])
            return
        }


        const readStream = fd.createReadStream();
        res.setHeader('Content-Type', filetype)
        res.setHeader('Content-Length', stat.size)

        console.log(req.method)
        console.log(action[1])
        console.log(openURL)
        console.log(filetype)
        //download
        if (action[1] == 'download') {
            res.setHeader('Content-Disposition', `attachment; filename=${filename};`)
            // readStream.pipe(res)


        }
       
        else if (req.method.toLowerCase() == 'delete') {
            res.setHeader('Content-Length','21')
            try {
                const fd = await open(`.${openURL}`)
                const stat = (await fd.stat())
                const isDirectory = stat.isDirectory()
                handleDelete(isDirectory, openURL, res)
            } catch (err) {
                res.end('file not found')
            }
            res.end('delete succesfully')
            return
        }
        readStream.pipe(res)
        readStream.on('close', () => {
            readStream.close()
            fd.close()
        })
        readStream.on('error', () => {
            res.end('error occured while downloading')
        })

    } catch {
        res.end('error try again')
    }

}



}

//handle rename

async function handleRename(filename,openURL,req,res){
   
    console.log('filename',filename)
    // console.log('headerName',req.headers)
    console.log(filename)
    const renamePath = `.${openURL.slice(0,openURL.lastIndexOf('/')+1)}${filename}.${openURL.slice(openURL.lastIndexOf('.')+1)}`;
    console.log('renamePath',renamePath)
   try{
    await rename(`.${openURL}`,`${renamePath}`)
    res.end('File Renamed Successfully')
   }catch(err){
        res.end('error occured try again')
        console.log('error occured while naming')
    }   
}
//handles delete
async function handleDelete(isDirectory, openURL, res) {

    if (isDirectory) {
        fsPromises.rmdir(`.${openURL}`, { recursive: true, force: true })
    }
    fsPromises.rm(`.${openURL}`)
    return
}

//handles the user uploaded resources
async function handleUpload(req, res) {
    const stream = createWriteStream(`./storage/${req.headers.filename}`)
    req.pipe(stream)

    req.on('close', () => { console.log('uploaded'); })
    req.on('close', () => {
        res.end('uploaded successfully')
    })

}



//read intial files from storage folder
async function readStorage(res, dir) {
    const userResources = await readdir(`.${dir ? dir : '/storage'}`)
    // console.log(userResources)

    res.end(JSON.stringify(userResources))
}

server.listen(4000,'192.168.1.114', (cl) => {
    console.log('server started')
})

server.on('error', () => {
    console.log('error occured at server')
})