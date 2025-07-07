
import cors from 'cors'
import express from "express";
import FileRoutes from "./routes/FileRoutes.js"
import FolderRoutes from "./routes/FolderRoutes.mjs"
import UserRoutes from "./routes/UserRoutes.js"
import cookieParser from 'cookie-parser';
import getConnection from './dbConnection.js';
import os from 'node:os'
const port = 4000;
const ip = getLocalIpAddress()
import checkAuth from './middlewares/auth.js';
import { contentType } from 'mime-types';
//express application to create routes
const app = express();
console.log(getLocalIpAddress())

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const iface = interfaces[interfaceName];
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1'; // Default to localhost if no suitable IP found
}

try {
    const db = await getConnection();
    //global middleware for each request
    app.use(cors({
        origin: ['http://localhost:5173', 'http://localhost:5174','*'], // Or specify allowed origins
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization','dirid','dirname','newname'],
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


