import express from 'express';

const app = express();

app.use(express.static('public'))

app.use((req,res,next)=>{
    let allowed = ['http://localhost:4000', 'http://192.168.100.7:4000'];

    if(allowed.includes(req.headers.origin)){
        allowed = req.headers.origin
    }
   
    res.setHeader('Access-Control-Allow-Origin',allowed)
    res.setHeader('Access-Control-Allow-Methods',"PUT")
    next()
})
app.get('/api',(req,res)=>{
    res.end(JSON.stringify({"name":"manoj"}))
})

app.put('/api',(req,res)=>{
    res.end(JSON.stringify({name:"man"}))
})

app.listen(4000,()=>{
    console.log('server is running')
})