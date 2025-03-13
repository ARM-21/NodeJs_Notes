import FilesData from '../FilesDB.json' with { type: "json" };
import FolderData from '../FolderDB.json' with {type: "json"};
import fsPromises, { open, stat, } from "node:fs/promises";
import fs, { writeFile } from "node:fs";
import express from "express";
import path from "node:path";

const router = express.Router();

//serves static files
router.get('/:id', async (req, res) => {

    const id = req.params.id
    console.log(id)
    const file = FilesData.filter((file) => {
        console.log(file.id)
        return file.id == id
    })[0];
    console.log(file.name)
    const fullPath = path.join(import.meta.dirname, '..', `/storage/${file.id}${file.extension}`)

    if (req.query.action == 'download') {
        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(id)}`)
    }
    res.sendFile(fullPath, (err) => {
        if (err) {
            res.end(JSON.stringify('error', err.message))
        }
    })

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
    const fileDetails = FilesData.filter((file) => {
        return file.id == req.params.id
    })[0];
    //returns if file doesn't exists
    if (!fileDetails) {
        res.json({ message: "file not found" })
        return
    }
    const filename = `${fileDetails.id}${fileDetails.extension}`
    //checks if it is a folder or a file to act accordingly
    // const fd = await open(`./storage/${filename}`)
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
    console.log(req.body.newname)
    const file = FilesData.find((file) => {
        return file.id == id
    });
    console.log(file)
    if (!file) {
        res.json({ message: "file not found" })
        return
    }
    try {
        file.name = req.body.newname
        writeFile('./FilesDB.json', JSON.stringify(FilesData), (err) => {
            if (err) {
                res.end(JSON.stringify({ message: "Error renaming file" }))
            }
        })
        res.status(200).json({ message: 'file renamed successfully' })
    } catch (err) {
        res.status(400).json({ message: err })
    }



})
//file uploading 
router.post('/:filename', async (req, res) => {
    const filename = req.params.filename;
    const dirID  = req.headers.dirid || FolderData[0].id;
    const extension = path.extname(filename);
    const id = crypto.randomUUID()
    const fileFullName = `${id}${extension}`
    try {
        const writeStream = fs.createWriteStream(`./storage/${fileFullName}`)
        req.pipe(writeStream)
        res.end(JSON.stringify({ "name": 'File Uploaded Successfully' }))
        writeStream.on('finish', () => {
            FilesData.push({
                id,
                name: filename,
                extension,
                parentId: dirID
            })
            const associatedFolder = FolderData.find((folder) => {
                return folder.id == dirID
            })
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


        })
    } catch (err) {
        res.end(JSON.stringify({ "name": err.message }))
    }
})

export default router;