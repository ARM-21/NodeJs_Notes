import net from "node:net";
import http from "node:http";

//http is also based on tcp
//we use same createServer() to create server.

const tcpServer = net.createServer();

tcpServer.listen(3000,'0.0.0.0',(server)=>{
    console.log("server is listening at port number",tcpServer.address().port)
})

tcpServer.on('connection',(socket)=>{
    // console.log(rmt.read())
    socket.on('data',(data)=>{
        console.log(data.toString())
        
    })
   
    console.log(socket.remoteAddress)
    console.log(socket.remotePort)

    // socket.send
    console.log( 'connected')
    socket.write('got your data')
    // socket.end()
})

tcpServer.on('drop',()=>{
    console.log('connection dropped')
})
//tcp server is also based on event emmiter so we can listen and emit event