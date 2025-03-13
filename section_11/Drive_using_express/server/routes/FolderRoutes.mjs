import { mkdir, readdir, stat } from "node:fs/promises";
import express from "express";
import path from "node:path";
import FolderData from "../FolderDB.json" with {type: "json"};
import FilesData from "../FilesDB.json" with {type: "json"};
import { writeFile } from "node:fs";
const router = express.Router();

//server directory
router.get("/:id?", (req, res) => {
    const { id } = req.params;

    if (!id) {
       const files = FolderData[0].files.map((data)=>{
           return FilesData.find((file)=>{
                return file.id == data
            })
        })  
        ;
        res.json({...FolderData[0],files})
    }
    else{
        const folder = FolderData.find((data)=>{ return data.id == id})
       const files = folder.files.map((filename)=>{
            return FilesData.find((data)=>{ return filename == data.id})
        })
       res.json({...folder,files})
    }


})

//create directory 
router.post('/:foldername', async (req, res) => {
    let doesExists = false
    const folderId = crypto.randomUUID();
    console.log(req.body)
    const basePath = `./storage/${folderId}`
    try {
        const makeDirectory = await mkdir(basePath)
        let files = [];
        let folder = [];
        const content = await readdir(basePath)
        content.map(async (data) => {
            const status = (await stat(`./storage/${data}`)).isDirectory()
            if (status) {
                folder.push(data)
            }
            else {
                files.push(data)
            }
        })

        FolderData.push(
            {
                id: folderId,
                name: req.params.foldername,
                parentId: null,
                content: {
                    files,
                    Directories: folder
                }
            }
        )
        writeFile('./FolderDB.json', JSON.stringify(FolderData), (err) => {
            if (err) {
                res.end(JSON.stringify({ message: err }))
                return
            }
        })
        res.json({ message: "posted successfully" })
    } catch (error) {
        console.log(error)
        res.end(JSON.stringify({ message: "error occured" }))
    }




    // try{
    //     const folderName = path.join("/",req.body.foldername);
    //     const readDir = await readdir(`./storage${folderName == ''? '':'/'+folderName}`)
    //     console.log(readDir)
    //     for ( let names of readDir){
    //         if(names === req.body.filename){
    //             console.log(names)
    //             res.send({message:"FOlder already exists"})
    //             break;
    //         } 
    //     }

    // }
    // catch(err){
    //     doesExists = false
    //     console.log('folder not created')
    // }

    // try{
    //     const createFolder = await mkdir(`./storage/${req.params['0']? req.params['0']: ''}`)
    //     res.send({message:"FOlder created successfully"})
    //     console.log("FOlder created successfully")
    // }catch(err){
    //     res.send({message:"FOlder creation unsuccessfully"})

    // } 
})

async function readStorage(res, dir) {

    try {
        const path = `.${dir ? dir : '/storage'}`;
        const userResources = await readdir(path)

        const data = await Promise.all(userResources.map(async (resource) => {
            const isDirectory = await stat(`${path}/${resource}`);
            return { name: resource, isDirectory: isDirectory.isDirectory() };
        }))

        res.json(data)
    } catch (err) {
        res.json({ "message": err.message })
    }

}

export default router;