/**Object,create(null)  to create a object without any property (prototype also)*/
import express from "express";
// import fsp, { open } from "fs/promises"
import cors from "cors"
import fs from "node:fs"
import path from "node:path";
const app = express();
app.use(cors({origin:"*", "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"}))
// app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.text())

app.post("/user",(req,res)=>{
  req.on('data',(chnk)=>{
    console.log(chnk.toString())
  })
  console.log(req.body)
  res.json({message:'got data'})
})
const port = 4000;
app.listen(port,()=>{
  console.log("server is running")
})