import express from "express";

const app = express();

app.get("/blogs/:blogid",(req,res)=>{
  res.json({message:"got the blogId"+req.params.blogid})
})

app.listen(4000,()=>{
    console.log("server is listening")
})