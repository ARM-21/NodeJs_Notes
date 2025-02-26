import fsPromises, { open, readdir, readFile, rename } from "node:fs/promises";
import cors from 'cors'
// import http from "node:http";
import mime, { contentType } from 'mime-types';
import fs, { createWriteStream } from "node:fs";
import express from "express";
import { fileTypeFromBuffer, fileTypeFromStream } from "file-type"


const port = 4000;
const ip = '192.168.100.7'

//express application to create routes
const app = express();

//global middleware for each request
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', '*')
    res.set('Access-Control-Allow-Headers', '*')
    express.json()(req, res, next)
    // next()
})

app.options('*',(req,res,next)=>{
    res.status(200).send()
})
//read index serve it
app.get('/', (req, res) => {
    readStorage(res)
})

//serves static files
app.get('/:filename', async (req, res, next) => {
    const filename = req.params.filename
    if (req.query.action == 'download') {
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
        res.sendFile(`${import.meta.dirname}/storage/${filename}`)
    }
    else {
        res.sendFile(`${import.meta.dirname}/storage/${filename}`)
    }


})

//for favicon
app.get('/favicon.ico',(req,res)=>{
    res.sendFile(`${import.meta.dirname}/alert.png`)
})

//deleting the file
app.delete('/:filename', async (req, res, next) => {
    const filename = req.params.filename
    const fd = await open(`./storage/${filename}`)
    const stat = (await fd.stat())
    if (stat.isDirectory()) {
        fsPromises.rmdir(`./storage/${filename}`, { recursive: true, force: true })
    }
    fsPromises.rm(`./storage/${filename}`)
    res.json({ success: 'true', 'message': 'ended successfully' })
    fd.close()


})

app.patch('/:filename', async (req, res, next) => {
    console.log(req.body)
    const filename = req.params.filename
    console.log(filename)
    try{
        fsPromises.rename(`./storage/${filename}`, `./storage/${req.header('filename')}${filename.slice(filename.lastIndexOf('.'))}`)
        res.status(200).end('file renamed successfully')
    }catch(err){
        res.status(404).end('error occured')
    }
    


})
//file uploading 
app.post('/:filename',async (req,res)=>{
   
    try{
        const writeStream = fs.createWriteStream(`./storage/${req.params.filename}`)
        req.pipe(writeStream)
        res.end('File Uploaded Successfully')
    }catch(err){
        res.end('Error occured while sending') 
    }
   

})

//server listening
app.listen(port, ip, () => {
    console.log('server is running at a ' + port)
})

// const server = http.createServer(async (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader('Access-Control-Allow-Headers', '*')
//     res.setHeader('Access-Control-Allow-Methods', 'DELETE,PATCH')



//     //handle other requests
//     // handleRequest(req, res)



// })



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
        res.setHeader('Content-Length', '25')
        // res.end('File rename Successfull')

        handleRename(renameFile, openURL, req, res);
        return
    }

    else {

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
                res.setHeader('Content-Length', '21')
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

async function handleRename(filename, openURL, req, res) {

    console.log('filename', filename)
    // console.log('headerName',req.headers)
    console.log(filename)
    const renamePath = `.${openURL.slice(0, openURL.lastIndexOf('/') + 1)}${filename}.${openURL.slice(openURL.lastIndexOf('.') + 1)}`;
    console.log('renamePath', renamePath)
    try {
        await rename(`.${openURL}`, `${renamePath}`)
        res.end('File Renamed Successfully')
    } catch (err) {
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

    res.json(userResources)
}

// server.listen(4000, '192.168.1.114', (cl) => {
//     console.log('server started')
// })

// server.on('error', () => {
//     console.log('error occured at server')
// })