
import cors from 'cors'
import express from "express";
import FileRoutes from "./routes/FileRoutes.js"
import FolderRoutes from "./routes/FolderRoutes.mjs"
import UserRoutes from "./routes/UserRoutes.js"
import cookieParser from 'cookie-parser';
const port = 4000;
const ip = '192.168.100.7'
import checkAuth from './auth.js';
//express application to create routes
const app = express();

//global middleware for each request
app.use(cors({origin:'http://localhost:5173',credentials:true}))
app.use(cookieParser())
app.use(express.json())
app.use('/user',UserRoutes)
app.use('/directory',checkAuth,FolderRoutes)
app.use('/file',checkAuth,FileRoutes)

app.use((err,req,res,next)=>{
    res.status(500).json({message:"Something Went Wrong"})
})

//server listening
app.listen(port,() => {
    console.log('server is running at a ' + port)
})
//read intial files from storage folder


