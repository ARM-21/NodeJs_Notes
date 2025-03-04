import fsPromises, { open, readdir, readFile, rename, stat } from "node:fs/promises";
import cors from 'cors'
// import http from "node:http";
import mime, { contentType } from 'mime-types';
import fs, { createWriteStream } from "node:fs";
import express from "express";
import { fileTypeFromBuffer, fileTypeFromStream } from "file-type";

const port = 4000;
const ip = '192.168.100.7'

//express application to create routes
const app = express();

//global middleware for each request
app.use(cors())
app.use(express.json())

//read index serve it
app.get('/', (req, res) => {
    readStorage(res)
})
//server directory
app.get("/directory*?", (req, res) => {
    console.log(req.params)
    if (req.params['0']) {
        readStorage(res, `/storage/${req.params['0']}`)

    }
    else {

        readStorage(res)
    }
})
//serves static files
app.get('/files/*', async (req, res, next) => {
    const filename = req.params['0']
    console.log(filename)   
    const file = await open(`./storage/${filename}`)
    if ((await file.stat()).isDirectory()) {
        readStorage(res, `/storage/${filename}`)
        file.close()
    }
    else {
        file.close()
    }

    if (req.query.action == 'download') {
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
        res.sendFile(`${import.meta.dirname}/storage/${filename}`)
    }
    else {
        res.sendFile(`${import.meta.dirname}/storage/${filename}`)
    }


})

//for favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(`${import.meta.dirname}/alert.png`)
})

//deleting the file
app.delete('/files/:filename', async (req, res, next) => {
    const filename = req.params.filename
    const fd = await open(`./storage/${filename}`)

    if ((await fd.stat()).isDirectory()) {
        readStorage()
    }
    const stat = (await fd.stat())
    if (stat.isDirectory()) {
        fsPromises.rmdir(`./storage/${filename}`, { recursive: true, force: true })
    }
    fsPromises.rm(`./storage/${filename}`)
    res.json({ success: 'true', 'message': 'ended successfully' })
    fd.close()


})

app.patch('/files/:filename', async (req, res, next) => {
    console.log(req.body)
    const filename = req.params.filename
    console.log(filename)
    try {
        fsPromises.rename(`./storage/${filename}`, `./storage/${req.header('filename')}${filename.slice(filename.lastIndexOf('.'))}`)
        res.status(200).end('file renamed successfully')
    } catch (err) {
        res.status(404).end('error occured')
    }



})
//file uploading 
app.post('/files/*', async (req, res) => {
    console.log(req.params['0'])
    try {
        const writeStream = fs.createWriteStream(`./storage/${req.params['0']}`)
        req.pipe(writeStream)
        res.end('File Uploaded Successfully')
    } catch (err) {
        res.end('Error occured while sending')
    }


})

//server listening
app.listen(port, ip, () => {
    console.log('server is running at a ' + port)
})
//read intial files from storage folder
async function readStorage(res, dir) {
    const path = `.${dir ? dir : '/storage'}`;
    const userResources = await readdir(path)

    const data = await Promise.all(userResources.map(async (resource) => {
        const isDirectory = await stat(`${path}/${resource}`);
        return { name: resource, isDirectory: isDirectory.isDirectory() };
    }))

    res.json(data)
}

