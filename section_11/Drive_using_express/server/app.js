import fsPromises, { mkdir, open, readdir, readFile, rename, stat } from "node:fs/promises";
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
    try{

        readStorage(res)
    }catch(err){
        res.end(err.message)
    }
})
//server directory
app.get("/directory/?*", (req, res) => {

    console.log("from dir lol",req.params)
    try{
        if (req.params['0']) {
            readStorage(res, `/storage/${req.params['0']}`)
    
        }
        else {
            readStorage(res)
        }
    }catch(err){
        res.end(err.message)
    }
    
})

//create directory 
app.post('/directory/?*', async (req,res)=>{
    let doesExists = false
    console.log(req.body)
    try{
        const folderName = req.body.foldername;
        const readDir = await readdir(`./storage${folderName == ''? '':'/'+folderName}`)
        console.log(readDir)
        for ( let names of readDir){
            if(names === req.body.filename){
                console.log(names)
                res.send({message:"FOlder already exists"})
                break;
            } 
        }
        
    }
    catch(err){
        doesExists = false
        console.log('folder not created')
    }
    
    try{
        const createFolder = await mkdir(`./storage/${req.params['0']? req.params['0']: ''}`)
        res.send({message:"FOlder created successfully"})
        console.log("FOlder created successfully")
    }catch(err){
        res.send({message:"FOlder creation unsuccessfully"})
        
    } 
})
//serves static files
app.get('/files/?*', async (req, res, next) => {
   
    const filename = req.params['0'] 
    console.log(filename)
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
app.delete('/files/?*', async (req, res, next) => {
    const filename = req.params['0']
    const correctedFile = decodeURIComponent(filename)
    const fd = await open(`./storage/${correctedFile}`)

    // if ((await fd.stat()).isDirectory()) {
    //     readStorage(res)
    // }
    const stat = (await fd.stat())
    if (stat.isDirectory()) {
        fsPromises.rm(`./storage/${filename}`, { recursive: true, force: true })
    }
    else{
        fsPromises.rm(`./storage/${filename}`)
    }
    res.json({ success: 'true', 'message': 'ended successfully' })
    fd.close()
    


})

app.patch('/files/?*', async (req, res, next) => {
  
    const filename = req.params['0']
   const slashContains = filename.includes('/');
    try {
        fsPromises.rename(`./storage/${filename?filename:""}`, `./storage${slashContains?"/"+filename.slice(0,filename.lastIndexOf('/')):""}/${req.header('filename')}${filename.slice(filename.lastIndexOf('.'))}`)
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

    try{
        const path = `.${dir ? dir : '/storage'}`;
        const userResources = await readdir(path)
    
        const data = await Promise.all(userResources.map(async (resource) => {
            const isDirectory = await stat(`${path}/${resource}`);
            return { name: resource, isDirectory: isDirectory.isDirectory() };
        }))
    
        res.json(data)
    }catch(err){
        res.json({"message":err.message})
    }
  
}

