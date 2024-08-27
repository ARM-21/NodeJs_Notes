import http from "http"

const server = http.createServer((req,res)=>{
    console.log(res);
    res.end("bye bye")
})

server.listen(4000);

