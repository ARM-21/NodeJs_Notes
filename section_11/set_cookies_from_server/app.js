import express from "express";

const app = express();


app.get('/',(req,res)=>{


    const date = new Date().toDateString()
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5501')
    res.setHeader('Access-Control-Allow-Credentials',true)
    // res.setHeader('Set-Cookie',"name=manoj;httponly")

    res.cookie("name","manoj",{
        sameSite:"strict"
    })
    res.end(JSON.stringify("hello"))
})
app.listen(4000,'192.168.100.7',(err)=>{
    console.log('Server is running')
})