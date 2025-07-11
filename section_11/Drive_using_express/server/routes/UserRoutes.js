import express from "express";
import auth from "./../middlewares/auth.js"
import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import validateId from "../middlewares/validateId.js";
import { ObjectId } from "mongodb";

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
        const userId = new ObjectId()
        const folderId = new ObjectId()

        const rootDirId = folderId.toString()
        const folderUserID = userId.toString()
        // userId
        //rootDirId:dirId
        let isUserCreated = await userCollection.insertOne({ _id:userId,username, email, password, rootDirId })
        let isFolderCreated = await userFolder.insertOne({ _id:folderId,name: `root-${email}`, parentId: null, userId:folderUserID })
        if (isUserCreated.acknowledged & isFolderCreated.acknowledged) {
            // const dir = await mkdir(`./storage/${folderId}`)
            return res.status(200).json({ message: "registration successfull" })
        }
        else {
            return res.status(501).json({ message: "registration unsuccessfull" })
        }


    }
    catch (err) {
        if(err.code == 121){
            const message = err.errInfo?.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied.map((field)=>{
                return {name:field.propertyName,reason:field.description};
            })
            console.log(message)
            return res.status(500).json({message:message,type:"registration"})
        }

        else{

            res.status(500).json({ message: "register unsuccessfull" + err.message,type:"registration" })
        }
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
            res.cookie('uid', userId, { sameSite: 'lax', secure: false ,httpOnly:true})
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