
import cors from 'cors'
import express from "express";
import FileRoutes from "./routes/FileRoutes.js"
import FolderRoutes from "./routes/FolderRoutes.mjs"
const port = 4000;
const ip = '192.168.100.7'
//express application to create routes
const app = express();

//global middleware for each request
app.use(cors())
app.use(express.json())
app.use('/file',FileRoutes)
app.use('/directory',FolderRoutes)

//server listening
app.listen(port, ip, () => {
    console.log('server is running at a ' + port)
})
//read intial files from storage folder


