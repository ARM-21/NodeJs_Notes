import fsPromises, { open } from "node:fs/promises";
import fs from "node:fs";
import express from "express";
import path from "node:path"

const router = express.Router();

//serves static files
router.get('/?*', async (req, res) => {
   
    const filename = path.join('/',req.params['0']) 
    const fullPath = path.join(import.meta.dirname,'..',`/storage/${filename}`)
    console.log(filename)

        if (req.query.action == 'download') {
            res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filename)}`)
            // res.sendFile( fullPath,(err)=>{
            //     if(err){
            //         res.json({error:'Error ocuured'})
            //     }
            // })
        }
            res.sendFile( fullPath,(err)=>{
                if(err){
                    res.end('error occures')
                }
            })
        
    
   
  


})

//for favicon
router.get('/favicon.ico', (req, res) => {
    res.sendFile(`${import.meta.dirname}/../alert.png`,(err)=>{
        if(err){
            res.json({error:'Error ocuured'})
        }
    })
})

//deleting the file
router.delete('/?*', async (req, res, next) => {
    const filename = path.join("/",req.params['0'])
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

router.patch('/?*', async (req, res, next) => {
  
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
router.post('/*', async (req, res) => {
    const filePath = path.join('/',req.params['0'])
    try {
        const writeStream = fs.createWriteStream(`./storage${filePath}`)
        req.pipe(writeStream)
        res.end('File Uploaded Successfully')
    } catch (err) {
        res.end('Error occured while sending')
    }


})

export default router;