import express from "express";
import multer from "multer"
// import fsp, { open } from "fs/promises"
import cors from "cors"
import fs from "node:fs"
import path from "node:path";
const app = express();
app.use(cors({origin:"*", "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"}))


// app.use(express.static("public"));
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.text())

app.post("/user",(req,res)=>{
  req.on('data',(chnk)=>{
    console.log(chnk.toString())
  })
  console.log(req.body)
  res.json({message:'got data'})
})

// app.post("/user",async (req, res) => {
//   // res.writeHead(200,'ok',{
//   //   "access-control-allow-origin":"*",
//   //   "access-control-allow-methods":"*"
//   // })
//   // const fd = await open("./file.txt");
//   // const writeStream = fd.createWriteStream()

//   // req.on('data',(chunk)=>{
//   //   writeStream.write(chunk)
//   // })
// const strm = fs.createWriteStream('./file.txt')

// req.pipe(strm)

// strm.on("finish", () => {
//   strm.close()
//   res.status(200).json({ message: "Got Data" });
// });
//   // const writableStream = fs.createWriteStream('./file.txt')
//   // req.pipe(fd.createWriteStream())
//   // res.status(200).json({ message: "Got Data" });
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });




/**with multer */

// const upload = multer({ dest: "uploads/" }); // Files saved in "uploads/"

// app.post("/user", upload.single("profilePic"), (req, res) => {
//     console.log("Received data:", {
//         name: req.body.name,
//         email: req.body.email,
//         file: req.file, // Uploaded file details
//     });
//     res.json({ message: "Upload successful!" ,file:req.file});
// });
// app.use(express.raw({ type: 'multipart/form-data', limit: '10mb' }));


/**without multer */
// app.post("/user", (req, res) => {
//     try {
//         // Parse the raw body manually (simplified example)
//         const boundary = req.headers['content-type'].split('=')[1];
//         const parts = req.body.toString().split(`--${boundary}`);
        
//         // Extract file data (simplified - in reality you'd need proper parsing)
//         const filePart = parts.find(part => part.includes('filename="profilePic"'));
//         if (filePart) {
//             const fileData = filePart.split('\r\n\r\n')[1].trim();
//             const fileName = `upload_${Date.now()}.dat`; // Generate unique filename
            
//             // Write file to disk
//             fs.writeFileSync(path.join(__dirname, 'uploads', fileName), fileData);
            
//             res.json({ 
//                 message: "Upload successful!",
//                 file: fileName
//             });
//         } else {
//             res.status(400).json({ error: "No file uploaded" });
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "File upload failed" });
//     }
// });


// app.post("/user",(req, res) => {


//     res.json({ message: "Upload successful!" ,file:''});
// });

app.listen(4000, () => console.log("Server running on http://localhost:4000"));