import { mkdir } from "node:fs/promises";
import express from "express";
import path from "node:path";
import FolderData from "../FolderDB.json" with {type: "json"};
import FilesData from "../FilesDB.json" with {type: "json"};
import UserDetails from "../UserDB.json" with {type: "json"};
import { rm, writeFile } from "node:fs";
import validateId from "../middlewares/validateId.js";
import { Db, ObjectId } from "mongodb";
const router = express.Router();

router.param('id', validateId)
//server directory
router.get("/:id?", async (req, res) => {
    const db = req.db;

    const folderCollection = db.collection('folders')
    const fileCollection = db.collection('files')

    const { uid } = req.cookies;
    const id = req.params.id || req.user.rootDirId
    console.log(uid, id)

    try {
        const folder = await folderCollection.findOne({ userId: uid, _id: new ObjectId(String(id)) })
        console.log('get folder', folder)

        if (!folder) {
            res.status(404).json({ message: `FOlder Not Found ${uid}` });
            return
        }
        const nestedFolders = await folderCollection.find({ parentId: id }).toArray()
        const nestedFiles = await fileCollection.find({ parentId: id }).toArray()
        return res.status(200).json({ ...folder, files: [...nestedFiles], folders: [...nestedFolders] })
    } catch (err) {
        return res.status(501).json({ "message": "Server error Try again later" })
    }

    // }
})
//create directory 
router.post('/:parentId?', async (req, res) => {
    const db = req.db;

    const folderCollection = db.collection('folders')
    const fileCollection = db.collection('files')
    const { uid } = req.cookies
    const directoryName = req.headers.dirname;
    /**optional if user want to upload in root folder*/
    const parentDirId = req.params.parentId || req.user.rootDirId;
    const folderId = crypto.randomUUID();

    try {
        if (req.params.parentId) {
            const associatedFolder = await folderCollection.findOne({ _id: new ObjectId(String(parentDirId)) })

            if (!associatedFolder) {
                res.status(404).json({ message: "Folder doesn't exists" })
                return
            }
        }
        else {
            return res.status(404).json({ message: "Folder doesn't exists" })
            FolderData[0].directories.push(folderId)
        }
        const newFolder = await folderCollection.insertOne({
            name: directoryName,
            parentId: parentDirId,
            userId: uid,
        })
        const basePath = `./storage/${newFolder.insertedId.toString()}`
        const makeDirectory = await mkdir(basePath)
        res.json({ message: "Folder Created successfully" })
    } catch (error) {
        console.log(error)
        res.status(400).end(JSON.stringify({ message: "error occured" }))
    }
})
//delete folders
router.delete('/:folderId?', async (req, res) => {
    //folder id
    const folderId = req.params.folderId;
    //parent directory id
    const parentIdUser = req.headers.dirid || req.user.rootDirId;
    //database collection

    const fileCollection = req.db.collection('files')
    const folderCollection = req.db.collection('folders')

    //main folder index
    let folder = await folderCollection.findOne({_id:new ObjectId(String(folderId))})

    if (!folder) {
        res.status(401).json({ message: "FOlder doesn't Exists" })
        return
    }
    let deleteFolderItself = await folderCollection.deleteOne({_id:new ObjectId(String(folderId))})
    let childFolderDelete = await folderCollection.deleteMany({parentId:folderId})
    let fileInsideFolderItself = await fileCollection.deleteMany({parentId:folderId})
    console.log(childFolderDelete)

    // rm(`./storage/${folderId}`, { force: true, recursive: true }, (err) => {
    //     if (!res.headersSent && err) {
    //         res.status(504).json({ message: "Error deleting FOlder" })
    //         return
    //     }
    // })

    res.status(200).json({ message: "removed sucessfully" })


})

router.patch("/:id", async (req, res) => {

    const folderId = req.params.id;
    const newname = req.headers.newname
    const fileCollection = req.db.collection('files')
    const folderCollection = req.db.collection('folders')
    const folder = await folderCollection.findOne({ _id: new ObjectId(String(folderId)) })
    if (!folder) {
        res.status(401).end("Folder Not found");
        return;
    }
    const updateFolder = await folderCollection.updateOne({ _id: new ObjectId(String(folderId)) }, { $set: { name: newname } })
    if (updateFolder.acknowledged) {
        res.setHeader('Access-Control-Expose-Headers', 'id');
        res.setHeader('id', folder._id.toString())
        return res.status(200).json({ message: "Renamed Successfully" })
    }
    else {
        return res.status(201).json({ message: "Renamed UnSuccessfully" })
    }

    // const 

})
export default router;