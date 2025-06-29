import FilesData from '../FilesDB.json' with { type: "json" };
import FolderData from '../FolderDB.json' with {type: "json"};
import fsPromises, { stat } from "node:fs/promises";
import fs, { writeFile } from "node:fs";
import express from "express";
import path from "node:path";
import validateId from '../middlewares/validateId.js';
import { ObjectId } from 'mongodb';
const router = express.Router();


//validation for id
router.param('id', validateId)
//serves static files
router.get('/:id', async (req, res) => {
    try {
        const db = req.db;
        const id = req.params.id
        const fileCollection = db.collection('files');
        //look for file
        const fileData = await fileCollection.findOne({ _id: new ObjectId(String(id)) })
        if (!fileData) {
            res.status(401).json({ message: "file doesn't exists " })
            return;
        }
        //look for folder as we have userId in it to check
        const folderCollection = db.collection('folders');
        const parentFolder = await folderCollection.findOne({ _id: new ObjectId(String(fileData.parentId)) })
        const doesUserMatch = parentFolder.userId == req.cookies.uid;

        if (!doesUserMatch) {
            res.status(401).json({ message: "unauthorized user" })
            return;
        }

        const fullPath = path.join(import.meta.dirname, '..', `/storage/${fileData._id}${fileData.extension}`)

        if (req.query.action == 'download') {
            return res.download(fullPath)
            // res.setHeader('Content-Disposition', `attachment; filename=${path.basename(file.name)}`)
        }
        res.sendFile(fullPath, (err) => {
            if (err) {
                res.end(JSON.stringify('error', err.message))
            }
        })
    }
    catch (err) {
        res.status(501).json({ message: "error occured" })
        return;
    }


})

//for favicon
router.get('/favicon.ico', (req, res) => {
    res.sendFile(`${import.meta.dirname}/../alert.png`, (err) => {
        if (err) {
            res.json({ error: 'Error ocuured' })
        }
    })
})

//deleting the file
router.delete('/:id', async (req, res) => {
    //extracts the particular file details
    const db = req.db;
    const fileCollection = db.collection('files');
    const fileDetails = await fileCollection.findOne({ _id:  new ObjectId(String(req.params.id)) })
    //returns if file doesn't exists
    if (!fileDetails) {
        res.status(401).json({ message: "file not found" })
        return
    }
    const folderCollection = db.collection('folders')
    const parentFolder = await folderCollection.findOne({ _id: new ObjectId(String(fileDetails.parentId)) })

    const doesUserMatch = parentFolder.userId == req.cookies.uid;

    if (!doesUserMatch) {
        res.status(401).json({ message: "unauthorized user" })
        return
    }
    const filename = `${fileDetails._id.toString()}${fileDetails.extension}`
    //checks if it is a folder or a file to act accordingly
    const status = (await stat(`./storage/${filename}`)).isDirectory()
    if (status) {
        fsPromises.rm(`./storage/${filename}`, { recursive: true, force: true })
    }
    else {
        fsPromises.rm(`./storage/${filename}`)
    }
    //removing details from FilesDB.json
    
    const isFileDeleted = await fileCollection.deleteOne({ _id: fileDetails._id })
    if(isFileDeleted){

        res.status(200).json({ success: 'true', 'message': 'deleted successfully' })
    }
    else{
        res.status(501).json({ success: 'false', 'message': 'deletion Unsuccessfully' })

    }


}
)

router.patch('/:id', async (req, res) => { 
    const { id } = req.params;
    const fileCollection = req.db.collection('files');
    const folderCollection = req.db.collection('folders');
    const file = await fileCollection.findOne({_id:new ObjectId(String(id))});

    if (!file) {
        res.status(401).json({ message: "file doesn't exists " })
        return
    }

    const parentFolder =await folderCollection.findOne({_id:new ObjectId(String(file.parentId))})

    const doesUserMatch = parentFolder.userId == req.cookies.uid;

    if (!doesUserMatch) {
        res.status(401).json({ message: "unauthorized user" })
        return;
    }

    try {
     const updateFile= await fileCollection.updateOne({_id:new ObjectId(String(id))},{$set:{name:req.headers.newname}});
       
       if(updateFile.acknowledged){
        res.setHeader('Access-Control-Expose-Headers', 'id');
            res.setHeader('id',file.parentId)
           res.status(200).json({ message: 'file renamed successfully' })
           return;
       }else{
        res.status(501).json({ message: 'Renaming unsuccessfull' })
           return;
       }
    } catch (err) {
        res.status(400).json({ message: err })
    }



})
//file uploading 
router.post('/:filename', async (req, res) => {
    try {
        const folderCollection = req.db.collection('folders');
        const fileCollection = req.db.collection('files');
        const filename = req.params.filename;
        console.log(filename)

        //optinal users might not sent the parentId for root
        console.log(req.user.rootDirId)
        const parentDirID = req.headers.dirid || req.user.rootDirId;
        const extension = path.extname(filename);
        const folderData = await folderCollection.findOne({ _id: new ObjectId(String(parentDirID)) })
        
        if (folderData.userId !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ error: "You do not have permission to upload to this directory." });
        }
        console.log('sucess')

        const fileId = await fileCollection.insertOne({
            name: filename,
            extension,
            parentId: parentDirID
        })
        const fileFullName = `${fileId.insertedId}${extension}`


        const writeStream = fs.createWriteStream(`./storage/${fileFullName}`)
        req.pipe(writeStream)

        writeStream.on('finish', () => {
            res.end(JSON.stringify({ "name": 'File Uploaded Successfully' }))


        })
    } catch (err) {
        res.end(JSON.stringify({ "name": err.message }))
    }
})

export default router;