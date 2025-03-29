import express from "express";
import userDetails from "../UserDB.json" with { type: "json" };
import directoryDetails from "./../FolderDB.json" with {type:"json"};
import crypto from "node:crypto";
import { writeFile } from "node:fs/promises";

const router = express.Router();

router.post("/register", async (req, res) => {
    try{
        const {username, email, password} = req.body.formData
        const alreadyExists = userDetails.find((user)=>{
            return email== user.email
        })
        if(alreadyExists){
            res.status(409).json({error:"Email already exists ",message:"a User with email already exists"})
            return;
        }
        const id = crypto.randomUUID();
        const dirId = crypto.randomUUID();

        directoryDetails.push({
            id:dirId,
            name:`root-${email}`,
            parentId:null,
            directories:[],
            files:[]
        })
        userDetails.push({
            username,
            email,
            password,
            id
        })
        console.log(userDetails)
        try{
            const response =  await writeFile('./UserDB.json', JSON.stringify(userDetails))
            const dirResponse =  await writeFile('./FolderDB.json', JSON.stringify(directoryDetails))
            res.status(200).json({message:"User Registration Successfull"})
        }catch(err){
            res.status(500).json({error:"Error occured ",message:"error occured !! User Registration Unsuccessfull"})

        }
      

    }
    catch(err){
        res.status(500).json({message:"register unsuccessfull"+err})
    }


})

router.post("/login", async (req, res) => {
    try{
        
    const userData = req.body.formData
    console.log(userData.username)
    console.log(userData.password)

        const userIndex = userDetails.findIndex((user)=>{
            console.log(user)
            return user.username == userData.username;
        })
        console.log(userIndex)
        if(userIndex < 0){
            res.status(404).json({message:"User Doesn't Exists"})
                return;
        }
        const userObj = userDetails[userIndex]
        if(userObj.username != userData.username || userObj.password != userData.password){
            res.status(404).json({message:"Username or password err"})
            return;
        }
            res.status(200).json({message:"User Login Successfull",userId:userDetails[userIndex].id})
                return;
    }
    catch(err){
        res.status(500).json({message:" Login unsuccessfull"})
    }


})


export default router;