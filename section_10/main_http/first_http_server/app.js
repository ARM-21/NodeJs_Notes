import http from "node:http";

const server = http.createServer()
// here is introduced a new event "request"
server.on('request',(req,res)=>{
console.log("connetion done ")
// res.writeHead(200,'ok',{'date':new Date().toLocaleDateString()})
// res.setHeader()
req.on('data',(chnk)=>{
    console.log('It only shows the data other than headers if available');
    console.log(chnk.toString())
})

// res.setHeader("Content-Length",22)
res.write('hello this from server')
res.end()
// res.end('done with the data')
})  
/**tcp bases connection */
server.on('connection',(socket)=>{
    socket.on('data',(chnk)=>{
        //headers are also considered as data in tcp not in http
        console.log('it shows all the data including headers')
        console.log(chnk)
    })
})
server.listen(3000,'192.168.100.7',()=>{
    console.log('server is running')
})
