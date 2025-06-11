import { mkdir } from "node:fs/promises";
import express from "express";
import path from "node:path";
import FolderData from "../FolderDB.json" with {type: "json"};
import FilesData from "../FilesDB.json" with {type: "json"};
import UserDetails from "../UserDB.json" with {type:"json"};
import { rm, writeFile } from "node:fs";
import validateId from "../middlewares/validateId.js";
const router = express.Router();

router.param('id',validateId)
//server directory
router.get("/:id?", (req, res) => {
    console.log("got rquest" )
   

    const { id } = req.params
    if (!id) {
        const {uid} = req.cookies;

        const folder = FolderData.find((folder)=>{
            return folder.userId == uid
        })
        const files = folder.files.map((data) => {
            return FilesData.find((file) => {
                return file.id == data
            })
        });

        if (!files) {
            res.json({ message: "Folder Not Found" });
            return
        }
        const directories = folder.directories.map((directory) => {
            return FolderData.find(({ id }) => { return id == directory })
        })
        res.status(200).json({ ...FolderData[0], files, directories })
    }
    else {
        const folder = FolderData.find((data) => { return data.id == id })
        console.log('get folder', folder)
        if (!folder) {
            res.status(404).json({ message: "FOlder Not Found" });
            return
        }
        const files = folder.files.map((filename) => {
            return FilesData.find((data) => { return filename == data.id })
        })
        const directories = folder.directories.map((directory) => {
            console.log(directory)
            return FolderData.find(({ id }) => {
                console.log(id == directory)
                return id == directory
            })
        })
        res.status(200).json({ ...folder, files, directories })
    }
})
//create directory 
router.post('/:parentId?', async (req, res) => {

   const {uid} = req.cookies
    const directoryName = req.headers.dirname;
    /**optional if user want to upload in root folder*/
    const parentDirId = req.params.parentId || req.user.rootDirId;
    const folderId = crypto.randomUUID();
    const basePath = `./storage/${folderId}`
    try {
        const makeDirectory = await mkdir(basePath)
        if (req.params.parentId) {
            const associatedFolder = FolderData.find(({ id }) => {
                return id == parentDirId
            })

            if(!associatedFolder){
                res.status(404).json({message:"Folder doesn't exists"})
                return
            }
            associatedFolder.directories.push(folderId)
        }
        else {
            FolderData[0].directories.push(folderId)
        }
        FolderData.push({
            id: folderId,
            name: directoryName,
            parentId: parentDirId,
            userId:uid,
            files: [],
            directories: []
        })
        writeFile('./FolderDB.json', JSON.stringify(FolderData), (err) => {
            if (err) {
                res.status(400).end(JSON.stringify({ message: "Error Writing" }))
                return
            }
        })
        res.json({ message: "posted successfully" })
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

    if(!folderIndex){
        res.status(400).json({message:"FOlder doesn't Exists"})
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