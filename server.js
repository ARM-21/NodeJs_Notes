import http from "node:http";

const server = http.createServer((req,res)=>{
    res.writeHead(200)
    if(req.url === '/home'){
        res.end('hello this is home')
    }
    else if(req.url === '/contact'){
        res.end('hello this is contact')
    }
else{
res.end('hello there')

}
})

server.listen(8000,()=>{
    console.log('server is running')
})