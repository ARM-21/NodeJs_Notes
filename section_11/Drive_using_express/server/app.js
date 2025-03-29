
import cors from 'cors'
import express from "express";
import FileRoutes from "./routes/FileRoutes.js"
import FolderRoutes from "./routes/FolderRoutes.mjs"
import UserRoutes from "./routes/UserRoutes.js"
const port = 4000;
const ip = '192.168.100.7'
//express application to create routes
const app = express();

//global middleware for each request
app.use(cors())
app.use(express.json())
app.use('/user',UserRoutes)
app.use('/directory',FolderRoutes)
app.use('/file',FileRoutes)

app.use((err,req,res,next)=>{
    res.status(500).json({message:"Something Went Wrong"})
})

//server listening
app.listen(port, ip, () => {
    console.log('server is running at a ' + port)
})
//read intial files from storage folder


