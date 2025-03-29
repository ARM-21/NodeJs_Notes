// import express from "express";
// import { createWriteStream } from "node:fs";
// import multer from "multer";
// import fs from "node:fs/promises"
// import path from "node:path";
// import cors from "cors"

// const app = express();
// app.use(cors())

//for different configurations
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       const id = crypto.randomUUID()
//       const extension = path.extname(file.originalname)
//       cb(null,  `${id}${extension}`)
//     }
//   })
  /**this is for default file id name */
//   const upload = multer({dest:"upload"})

//   const upload = multer({ storage: storage })
//this is for single upload
// app.post("/upload",upload.single("userFile"),(req,res)=>{
    
//         res.json({file:req.file})
    
// })

/**this is for multiple uplaods */

// app.post('/upload',upload.fields([{name:'userFile',maxCount:1},{name:'userFile2',maxCount:1}]),(req,res)=>{

//     console.log(req.files)
//     console.log(req.body)
//     res.json(req.files)
// })

// app.listen(3000,"192.168.100.7",()=>{
//     console.log("server is running")
// })


//deep
import express from "express";
import { createWriteStream } from "node:fs";
import multer from "multer";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto"; // 👈 Add this import
import cors from "cors";

const app = express();
app.use(cors());

 // 👈 Create directory on startup

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const id = crypto.randomUUID(); 
    const extension = path.extname(file.originalname);
    cb(null, `${id}${extension}`);
  },
});

const upload = multer({storage:storage});

// app.post(
//   "/upload",
//   upload.single('userFile2'),
//   (req, res) => {
//     console.log(req.files);
//     res.json({files:req.files}); // Send files metadata as JSON
//   }
// );

app.post('/upload',upload.single('userFile2'),(req,res)=>{
res.json({message:'nothing here'})
})

// Error handling middleware
app.use((err, req, res, next) => { // 👈 Handle errors properly
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(3000, "192.168.100.7", () => {
  console.log("Server is running");
});