import http from "node:http";

const server = http.createServer((req,res)=>{
    console.log("client connected "+ req.url)
    //it listens only on post from server
    req.on('data',(chnk)=>{
        console.log(chnk.toString())
    })
    res.end('from server')
})
server.listen(4000,'192.168.100.7',()=>{
    console.log('server is listening')
})