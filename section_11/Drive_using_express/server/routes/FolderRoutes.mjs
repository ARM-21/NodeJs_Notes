import { mkdir } from "node:fs/promises";
import express from "express";
import path from "node:path";
import { rm, stat } from "node:fs/promises";
import validateId from "../middlewares/validateId.js";
import { Db, ObjectId } from "mongodb";
import crypto from "node:crypto";
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
        
        // Add actual file sizes to the files
        const filesWithSizes = await Promise.all(
            nestedFiles.map(async (file) => {
                try {
                    const filePath = path.join(import.meta.dirname, '..', `/storage/${file._id}${file.extension}`)
                    const stats = await stat(filePath)
                    return {
                        ...file,
                        size: stats.size,
                        createdAt: stats.birthtime || stats.ctime,
                        modifiedAt: stats.mtime
                    }
                } catch (error) {
                    console.error(`Error getting file stats for ${file.name}:`, error)
                    return {
                        ...file,
                        size: 0,
                        createdAt: new Date(),
                        modifiedAt: new Date()
                    }
                }
            })
        )
        
        return res.status(200).json({ 
            ...folder, 
            files: filesWithSizes, 
            folders: nestedFolders 
        })
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


    try {
        // If parentId is provided, validate it exists
        if (req.params.parentId) {
            const associatedFolder = await folderCollection.findOne({ _id: new ObjectId(String(parentDirId)) })

            if (!associatedFolder) {
                res.status(404).json({ message: "Parent folder doesn't exist" })
                return
            }
        }
        // If no parentId, we're creating in root folder (use rootDirId)
        // This is allowed, so we proceed with the folder creation
        
        const newFolder = await folderCollection.insertOne({
            name: directoryName,
            parentId: parentDirId,
            userId: uid,
        })
        // const basePath = `./storage/${newFolder.insertedId.toString()}`
        // const makeDirectory = await mkdir(basePath)
        res.setHeader('Access-Control-Expose-Headers', 'id');
        res.setHeader('id', parentDirId)
        res.status(200).json({ message: "Folder Created successfully" })
    } catch (error) {
        console.log(error)
        res.status(400).end(JSON.stringify({ message: "error occured" }))
    }
})
//delete folders
router.delete('/:folderId?', async (req, res, next) => {
    // try {
    //folder id
    //parent directory id
    //parent directory id
    const folderId = req.params.folderId;
    const parentIdUser = req.headers.dirid || req.user.rootDirId;
    //database collection
    const fileCollection = req.db.collection('files')
    const folderCollection = req.db.collection('folders')
    //main folder index
    let folder = await folderCollection.findOne({ _id: new ObjectId(String(folderId)) })
    if (!folder) {
        res.status(401).json({ message: "FOlder doesn't Exists" })
        return
    }

    async function getAllContents(folderId) {
        if (folderId == '' || folderId == undefined) {
            return res.status('401').json({ message: "The User Request is invalid!" })
        }
        let folders = await folderCollection.find({ parentId: folderId }, { projection: { name: 1 } }).toArray()
        let files = await fileCollection.find({ parentId: folderId }, { projection: { name: 1,extension:1 } }).toArray()


        for (const folder of folders) {
            let { files: childFiles, folders: childFolders } = await getAllContents(folder._id.toString())
            files = [...files, ...childFiles]
            folders = [...folders, ...childFolders]
            // return [...files,...folders]
        }

        return { files, folders }
    }
    const { files, folders } = await getAllContents(folderId)
    console.log(files)
    console.log(folders)
    let deleteManyFiles, deleteManyFolders;

try {
    // Delete files from DB
    if (files.length > 0) {
        deleteManyFiles = await fileCollection.deleteMany({
            _id: { $in: files.map(f => f._id) }
        });
    }

    // Delete folders from DB (including root folder)
    if (folders.length > 0 || folder) {
        deleteManyFolders = await folderCollection.deleteMany({
            _id: { $in: [new ObjectId(String(folderId)), ...folders.map(f => f._id)] }
        });
    }

    // Check DB actually deleted
    if ((files.length > 0 && (!deleteManyFiles || deleteManyFiles.deletedCount === 0)) ||
        ((folders.length > 0 || folder) && (!deleteManyFolders || deleteManyFolders.deletedCount === 0))) {
        throw new Error("DB delete failed");
    }

    // Now safely delete physical files
    for (const { _id, extension } of files) {
        await rm(`./storage/${_id.toString()}${extension}`);
    }

    return res.status(200).json({ message: "Folder and its contents deleted successfully." });

} catch (err) {
    console.error("Delete failed:", err);

    // Restore DB if we already removed something
    if (files.length > 0) await fileCollection.insertMany(files);
    if (folders.length > 0) await folderCollection.insertMany(folders);

    return res.status(504).json({ message: "Error deleting folder or restoring data" });
}

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

// Get breadcrumb path for a folder
router.get("/:id/breadcrumbs", async (req, res) => {
    const db = req.db;
    const folderCollection = db.collection('folders');
    const { uid } = req.cookies;
    const id = req.params.id;

    try {
        const breadcrumbs = [];
        let currentId = id;
        
        // Build breadcrumb path by traversing up the parent hierarchy
        while (currentId) {
            const folder = await folderCollection.findOne({ 
                userId: uid, 
                _id: new ObjectId(String(currentId)) 
            });
            
            if (!folder) break;
            
            breadcrumbs.unshift({
                id: folder._id.toString(),
                name: folder.name
            });
            
            // Move to parent folder
            currentId = folder.parentId;
        }
        
        // Add root folder at the beginning
        breadcrumbs.unshift({
            id: null,
            name: 'My Files'
        });
        
        res.json({ breadcrumbs });
    } catch (error) {
        console.error('Error getting breadcrumbs:', error);
        res.status(500).json({ message: 'Error getting breadcrumbs' });
    }
});

export default router;