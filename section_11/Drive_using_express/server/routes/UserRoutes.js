import express from "express";
import userDetails from "../UserDB.json" with { type: "json" };
import directoryDetails from "./../FolderDB.json" with {type: "json"};
import auth from "./../middlewares/auth.js"
import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import validateId from "../middlewares/validateId.js";

const router = express.Router();


router.param('id', validateId)


router.post("/register", async (req, res) => {
    console.log("got for registration")
    try {
        const { username, email, password } = req.body.formData
        const userCollection = req.db.collection("users");
        const folderCollection = req.db.collection("folders");
        const userExists = await userCollection.findOne({ email: email })

        if (userExists != null) {
            return res.status(500).json({ message: "User Already existed", email })

        }
        //folder creation
        const userFolder = req.db.collection("folders");

        // userId
        //rootDirId:dirId
        let isUserCreated = await userCollection.insertOne({ username, email, password })
        let isFolderCreated = await userFolder.insertOne({ name: `root-${email}`, parentId: null })
        if (isUserCreated.acknowledged & isFolderCreated.acknowledged) {
            const userId = isUserCreated.insertedId.toString()
            const folderId = isFolderCreated.insertedId.toString()
            const updateRootDirId = await userCollection.updateOne({ _id: isUserCreated.insertedId }, { $set:{rootDirId: folderId} })
            console.log(updateRootDirId)
            const updateUserId = await folderCollection.updateOne({ _id: isFolderCreated.insertedId }, { $set:{userId} })
            console.log(updateUserId)
            const dir = await mkdir(`./storage/${folderId}`)
            return res.status(200).json({ message: "registration successfull" })
        }
        else {
            return res.status(501).json({ message: "registration unsuccessfull" })
        }


    }
    catch (err) {
        res.status(500).json({ message: "register unsuccessfull" + err })
    }


})

router.post("/login", async (req, res) => {
    try {
        const db = req.db;
        const userData = req.body.formData
        const userCollection = db.collection('users');


        const user = await userCollection.findOne({ email: userData.email});
        console.log("data of databse ", user)

        if (user == null) {
            res.status(404).json({ error: "User Doesn't Exists" })
            return;
        }
        if(user.password === userData.password) {
            const userId = user._id.toString()
            res.cookie('uid', userId, { sameSite: 'none', secure: true })
            res.status(200).json({ message: "User Login Successfull", userId: userId, userDir: user.rootDirId })
            return;
        }
        else {
            res.status(404).json({ error: "User credential Mismatches" })
            return;
        }
    }
    catch (err) {
        res.status(500).json({ error: " Login unsuccessfull" + err })
    }


})
router.post("/logout", auth, async (req, res) => {
    const { uid } = req.cookies;
    try {
        console.log('logput')
        res.cookie('uid', uid, { maxAge: 0 })
        res.status(200).json({ User: uid, message: 'Success' })

    }
    catch (err) {
        res.status(500).json({ error: " Login unsuccessfull" + err })
    }


})
router.get("/", auth, async (req, res) => {
    const { uid } = req.cookies;
    try {

        res.status(200).json({ username: req.user.username, email: req.user.email })

    }
    catch (err) {
        res.status(500).json({ error: " Unauthorized user" + err })
    }


})


export default router;