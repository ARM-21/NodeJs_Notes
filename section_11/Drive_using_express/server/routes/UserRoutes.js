import express from "express";
import userDetails from "../UserDB.json" with { type: "json" };
import directoryDetails from "./../FolderDB.json" with {type:"json"};
import auth from "./../middlewares/auth.js"
import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import validateId from "../middlewares/validateId.js";

const router = express.Router();


router.param('id',validateId)


router.post("/register", async (req, res) => {

    try{

        res.redirect
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
            userId:id,
            directories:[],
            files:[]
        })
        userDetails.push({
            username,
            email,
            rootDirId:dirId,
            password,
            id
        })
        console.log(userDetails)
        try{
            const response =  await writeFile('./UserDB.json', JSON.stringify(userDetails))
            const dirResponse =  await writeFile('./FolderDB.json', JSON.stringify(directoryDetails))
            const dir = await mkdir(`./storage/${dirId}`)
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
    console.log(userData.email)
    console.log(userData.password)

        const userIndex = userDetails.findIndex((user)=>{
            console.log(user)
            return user.email == userData.email;
        })
        console.log(userIndex)
        if(userIndex < 0){
            res.status(404).json({error:"User Doesn't Exists"})
                return;
        }
        const userObj = userDetails[userIndex]
        if(userObj.email != userData.email || userObj.password != userData.password){
            res.status(404).json({error:"Username or password error"})
            return;
        }
    //    const userDirectory = directoryDetails.find((dir)=>{
    //     console.log(dir.name)
    //         return dir.name == `root-${userObj.email}`
    //     })
        // console.log(userDirectory)
        // `/user/${userObj.id}`})
            res.cookie('uid',userObj.id,{sameSite:'none',secure:true})
            res.status(200).json({message:"User Login Successfull",userId:userObj.id,userDir:userObj.rootDirId})

                return;
    }
    catch(err){
        res.status(500).json({error:" Login unsuccessfull" + err})
    }


})
router.post("/logout", auth,async (req, res) => {
  const {uid} = req.cookies;
    try{
        console.log('logput')
        res.cookie('uid',uid,{maxAge:0})
        res.status(200).json({User:uid,message:'Success'})
   
    }
    catch(err){
        res.status(500).json({error:" Login unsuccessfull" + err})
    }


})
router.get("/", auth, async (req, res) => {
    const {uid} = req.cookies;
      try{
       
          res.status(200).json({username:req.user.username,email:req.user.email})
     
      }
      catch(err){
          res.status(500).json({error:" Unauthorized user" + err})
      }
  
  
  })


export default router;