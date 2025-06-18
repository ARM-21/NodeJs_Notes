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
    console.log("got rquest")

    const { uid } = req.cookies;
    // const folder = await folderDB.findOne({userId:uid,parentId:null})
    // if(!folder){
    //     return res.json("Message: No folder found for user id "+ "uid");
    // }
    const { id } = req.params
    // if (!id) {
    // const folder = FolderData.find((folder)=>{
    //     return folder.userId == uid
    // })
    // const files = folder.files.map(async (data) => {
    //     return await fileDB.findOne({_id:data})
    // });

    // if (!files) {
    //     res.json({ message: "Folder Not Found" });
    //     return
    // }
    // const directories = folder.directories.map(async (directory) => {
    //     return await FolderData.findOne({_id:directory})
    // })
    // res.status(200).json({ ...FolderData[0], files, directories })
    // }
    // else {
    try {
        const folder = await folderCollection.findOne({ userId: uid, _id: new ObjectId(String(id)), parentId: null })
        console.log('get folder', folder)

        if (!folder) {
            res.status(404).json({ message: `FOlder Not Found ${uid}` });
            return
        }
        const nestedFolders = await folderCollection.find({ parentId: id }).toArray()
        const nestedFiles = await fileCollection.find({ parentId: id }).toArray()
        return res.status(200).json({ ...folder, files:[...nestedFiles], folders:[...nestedFolders] })
    } catch (err) {
        return res.status(501).json({ "message": "Server Crashed Try again later" })
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
            const associatedFolder = await folderCollection.findOne({ _id:new ObjectId(String(parentDirId)) })

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
router.delete('/:folderId?', (req, res) => {
    //folder id
    const folderId = req.params.folderId;
    //parent directory id
    const parentIdUser = req.headers.dirid || req.user.rootDirId;

    //main folder index
    let folderIndex = FolderData.findIndex(({ id }) => id == folderId)

    if (!folderIndex) {
        res.status(400).json({ message: "FOlder doesn't Exists" })
        return
    }
    if (folderIndex >= 0) {
        //parent directory index
        let associatedDirIndex = FolderData.findIndex(({ id, parentId }) => { return id == parentIdUser })
        //index of parentDirectory of file inside parent dir directories folder
        if (FolderData[folderIndex].files.length > 0) {
            FolderData[folderIndex].files.map((parentFileId) => {
                const indexOfFile = FilesData.findIndex(({ id }) => {
                    return parentFileId == id;
                })
                if (indexOfFile >= 0) {
                    console.log("removing file id", FilesData[indexOfFile].id)
                    rm(`./storage/${FilesData[indexOfFile].id}${FilesData[indexOfFile].extension}`, (err) => {
                        console.log("error from file", err)
                        if (!res.headersSent && err) {
                            res.status(400).json({ message: "Something went wrong" })
                            return
                        }
                    })
                    FilesData.splice(indexOfFile, 1)
                }
                else {
                    console.log("no file exists")
                }

            })
        }

        if (FolderData[folderIndex].directories.length > 0) {
            FolderData[folderIndex].directories.map((parentFileId) => {
                const indexOfFolder = FolderData.findIndex(({ id }) => {
                    return parentFileId == id;
                })
                if (indexOfFolder >= 0) {
                    rm(`./storage/${FolderData[indexOfFolder].id}`, (err) => {
                        if (!res.headersSent && err) {
                            res.status(400).json({ message: "Error while writing" })
                            return
                        }
                    })
                    FolderData.splice(indexOfFolder, 1)
                }

            })
        }
        else {
            console.log("no folder exists")
        }

        let folderIndexParentDir = FolderData[associatedDirIndex].directories.findIndex(({ id }) => { return id == folderId })
        FolderData[associatedDirIndex].directories.splice(folderIndexParentDir, 1)
        FolderData.splice(folderIndex, 1)
    }
    else {
        res.status(404).json({ message: "folder not found" })
        return
    }


    rm(`./storage/${folderId}`, { force: true, recursive: true }, (err) => {
        if (!res.headersSent && err) {
            res.status(504).json({ message: "Error Creating FOlder" })
            return
        }
    })

    writeFile('./FolderDB.json', JSON.stringify(FolderData), (err) => {
        if (err) {
            res.status(504).json({ message: "error occured while writing" })
            return
        }
    })

    writeFile('./FilesDB.json', JSON.stringify(FilesData), (err) => {
        if (err) {
            res.status(504).json({ message: "error occured while writing" })
            return
        }
    })


    res.json({ message: "removed sucessfully" })


})

router.patch("/:id", async (req, res) => {

    const folderId = req.params.id;
    const newname = req.headers.newname
    const folder = FolderData.find(({ id }) => {
        return id == folderId
    })
    if (!folder) {
        res.status().end("Folder Not found");
        return;
    }


    folder.name = newname;
    writeFile(`./FolderDB.json`, JSON.stringify(FolderData), (err) => {
        if (err && res.headersSent) {
            res.status(201).json({ message: "Renamed UnSuccessfully" })
        }
        else {
            res.status(200).json({ message: "Renamed Successfully" })
        }
    })



    // const 

})
export default router;