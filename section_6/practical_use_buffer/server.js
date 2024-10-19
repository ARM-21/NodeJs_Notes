import http from 'http';


const server = http.createServer((req,res)=>{

    req.on('data', (reBody)=>{
        console.log(JSON.parse(reBody.toString()).name);
    }
   
)
res.setHeader('Content-Type', 'text/html,charset=utf-8')
res.setHeader('Access-Control-Allow-Origin', '*')
    // console.log(req)
    res.end('Hello World this is a response from server');
})

server.listen(3000, ()=>{
    console.log('Server is running on port 3000');
}
)