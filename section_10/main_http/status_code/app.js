import http from "node:http";

const server = http.createServer((req,res)=>{
	// res.statusCode = 200;
    res.writeHead(200,{'content-type':'application/json'})
	res.end(JSON.stringify({"name":"man","hello":"bye"}))
})
server.listen(4000,()=>{
    console.log('server is listening')
})