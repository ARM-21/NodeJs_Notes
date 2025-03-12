import { mkdir, readdir, stat } from "node:fs/promises";
import express from "express";
import path from "node:path"
 const router = express.Router();



//read index serve it
router.get('/', (req, res) => {
    try{

        readStorage(res)
    }catch(err){
        res.end(err.message)
    }
})

//server directory
router.get("/?*", (req, res) => {

    console.log("from dir lol",req.params)
    let baseUrl = `/storage/${req.params['0']}`;
    let accessPath = path.join("/",baseUrl)
    try{
        if (req.params['0']) {
            readStorage(res, accessPath)
    
        }
        else {
            readStorage(res)
        }
    }catch(err){
        res.end(err.message)
    }
    
})

//create directory 
router.post('/?*', async (req,res)=>{
    let doesExists = false
    console.log(req.body)
    try{
        const folderName = path.join("/",req.body.foldername);
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

export default router;