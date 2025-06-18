
import cors from 'cors'
import express from "express";
import FileRoutes from "./routes/FileRoutes.js"
import FolderRoutes from "./routes/FolderRoutes.mjs"
import UserRoutes from "./routes/UserRoutes.js"
import cookieParser from 'cookie-parser';
import getConnection from './dbConnection.js';
const port = 4000;
const ip = '192.168.1.114'
import checkAuth from './middlewares/auth.js';
import { contentType } from 'mime-types';
//express application to create routes
const app = express();

try {
    const db = await getConnection();
    //global middleware for each request
    app.use(cors({
        origin: ['http://localhost:5173'], // Or specify allowed origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization','dirid','dirname'],
        credentials: true
    }));
    app.use((req, res, next) => {
        req.db = db
        next()
    })
    app.use(cookieParser())
    app.use(express.json())
    app.use('/user', UserRoutes)
    app.use('/directory', checkAuth, FolderRoutes)
    app.use('/file', checkAuth, FileRoutes)

    app.use((err, req, res, next) => {
        res.status(500).json({ message: "Something Went Wrong" })
    })

    //server listening
    app.listen(port, () => {
        console.log('server is running at a ' + port)
    })
} catch (err) {
    console.log("Database connection error" + err.message)
}

//read intial files from storage folder


