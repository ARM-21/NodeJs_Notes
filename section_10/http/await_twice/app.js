import { open } from "node:fs/promises";
import net from "node:net";

const server = net.createServer(async (socket)=>{
    const file = await open('./numbers.txt');
    const { size } = await file.stat()
    const streamData = file.createReadStream({highWaterMark:1})
    console.log('connected done with ', socket.remoteAddress)

    socket.write('HTTP/1.1 200 OK\n')
    socket.write('Access-Control-Allow-Origin: *\n')
    // socket.write('Access-Control-Expose-Headers: * ')
    socket.write(`Content-Length: ${size}`)
    socket.write('\n\n')
    streamData.on('data',(chunk)=>{
        socket.write(chunk)
        socket.pause()
        setTimeout(()=>{
            socket.resume()
        },5000)
    })
    

    // streamData.pipe(socket)

    socket.on('error',()=>{
        console.log("error occured at socket")
    })
    streamData.on('error',()=>{
        console.log('error in read stream')
    })
});

server.on('error',()=>{
    console.log('server lost')
})
server.listen(3000,'192.168.100.7',()=>{
    console.log('server started')
})