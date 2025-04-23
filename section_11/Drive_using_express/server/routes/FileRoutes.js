import FilesData from '../FilesDB.json' with { type: "json" };
import FolderData from '../FolderDB.json' with {type: "json"};
import fsPromises, { stat } from "node:fs/promises";
import fs, { writeFile } from "node:fs";
import express from "express";
import path from "node:path";
import validateId from '../middlewares/validateId';
const router = express.Router();


//validation for id
router.param('id',validateId)
//serves static files
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const fileData = FilesData.find((filesid) => {
            return id == filesid.id
        })
        if (!fileData) {
            res.status(401).json({ message: "file doesn't exits " })
            return;
        }
        console.log(fileData)
        const parentFolder = FolderData.find((folder) => {
            return folder.id == fileData.parentId;
        })
        console.log("parent", parentFolder)
        const doesUserMatch = parentFolder.userId == req.cookies.uid;

        if (!doesUserMatch) {
            res.status(401).json({ message: "unauthorized user" })
            return;
        }

        const file = FilesData.find((file) => {
            console.log(file.id)
            return file.id == id
        });

        console.log(file)

        if (!file) {
            res.end(JSON.stringify({ message: "FIle not Found" }))
            return;
        }
        const fullPath = path.join(import.meta.dirname, '..', `/storage/${file.id}${file.extension}`)

        if (req.query.action == 'download') {
          return  res.download(fullPath)
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
    const fileDetails = FilesData.find((file) => {
        return file.id == req.params.id
    });

    const parentFolder = FolderData.find((folder) => {
        return folder.id == fileDetails.parentId;
    })
    console.log("parent", parentFolder)
    const doesUserMatch = parentFolder.userId == req.cookies.uid;

    if (!doesUserMatch) {
        res.status(401).json({ message: "unauthorized user" })
        return
    }


    //returns if file doesn't exists
    if (!fileDetails) {
        res.status(401).json({ message: "file not found" })
        return
    }
    const filename = `${fileDetails.id}${fileDetails.extension}`
    //checks if it is a folder or a file to act accordingly
    const status = (await stat(`./storage/${filename}`)).isDirectory()
    if (status) {
        fsPromises.rm(`./storage/${filename}`, { recursive: true, force: true })
    }
    else {
        fsPromises.rm(`./storage/${filename}`)
    }
    res.json({ success: 'true', 'message': 'deleted successfully' })
    //removing details from FilesDB.json
    const fileIndex = FilesData.findIndex((file) => { return file.id == req.params.id })
    if (fileIndex == -1) {
        res.status(404).json({ message: "File doesn't exists" })
        return
    }
    FilesData.splice(fileIndex, 1)


    //removing that particular file from Folder's files also
    const associatedFolder = FolderData.find((folder) => {
        return folder.id == fileDetails.parentId
    })

    associatedFolder.files = associatedFolder.files.filter((file) => {
        return file != fileDetails.id
    })
    // writes in FolderDB.json
    const writeInFolder = writeFile(`./FolderDB.json`, JSON.stringify(FolderData), (err) => {
        if (err) {
            console.log(err)
        }
    })
    //writes in filesDB.json
    const writeInFile = writeFile(`./FilesDB.json`, JSON.stringify(FilesData), (err) => {
        if (err) {
            console.log(err)
        }
    })


})

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const file = FilesData.find((file) => {
        return file.id == id
    });

    if (!file) {
        res.status(401).json({ message: "file doesn't exits " })
        return
    }
    console.log(file)
    const parentFolder = FolderData.find((folder) => {
        return folder.id == file.parentId;
    })
    console.log("parent", parentFolder)
    const doesUserMatch = parentFolder.userId == req.cookies.uid;

    if (!doesUserMatch) {
        res.status(401).json({ message: "unauthorized user" })
        return;
    }


    console.log(file)
    if (!file) {
        res.json({ message: "file not found" })
        return
    }


    try {
        file.name = req.headers.newname
        writeFile('./FilesDB.json', JSON.stringify(FilesData), (err) => {
            if (err) {
                res.end(JSON.stringify({ message: "Error renaming file" }))
                return;
            }
        })
        res.status(200).json({ message: 'file renamed successfully' })
        return;
    } catch (err) {
        res.status(400).json({ message: err })
    }



})
//file uploading 
router.post('/:filename', async (req, res) => {
    const filename = req.params.filename;

    //optinal users might not sent the parentId for root
    console.log(req.user.rootDirId)
    const parentDirID = req.headers.dirid || req.user.rootDirId;
    const extension = path.extname(filename);
    const id = crypto.randomUUID()
    const fileFullName = `${id}${extension}`

    const folderData = FolderData.find(({ id }) => {
        return id == parentDirID
    })
    console.log("post", req.user.id)
    if (folderData.userId !== req.user.id) {
        return res
            .status(403)
            .json({ error: "You do not have permission to upload to this directory." });
    }


    try {
        const writeStream = fs.createWriteStream(`./storage/${fileFullName}`)
        req.pipe(writeStream)

        writeStream.on('finish', () => {
            FilesData.push({
                id,
                name: filename,
                extension,
                parentId: parentDirID
            })
            const associatedFolder = FolderData.find((folder) => {
                return folder.id == parentDirID
            })

            if (!associatedFolder) {
                res.status(400).json({ message: "NO folder Exists" })
                return
            }
            if (associatedFolder.userId !== req.user.id) {
                return res
                    .status(403)
                    .json({ error: "You do not have permission to upload to this directory." });
            }
            associatedFolder.files.push(id)


            writeFile('./FolderDB.json', JSON.stringify(FolderData), (err) => {
                if (err) {
                    console.log(err)
                }
            })
            writeFile('./FilesDB.json', JSON.stringify(FilesData), (err) => {
                if (err) {
                    console.log(err)
                }
            })
            res.end(JSON.stringify({ "name": 'File Uploaded Successfully' }))


        })
    } catch (err) {
        res.end(JSON.stringify({ "name": err.message }))
    }
})

export default router;