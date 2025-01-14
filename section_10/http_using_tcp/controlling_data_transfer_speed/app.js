import { chownSync } from "node:fs";
import { open } from "node:fs/promises";
import net from "node:net";

const server = net.createServer((async (socket)=>{
    console.log('connection with '+ socket.remoteAddress)
    const fd = await open('/home/arm-21/Desktop/vid.mp4');
    const steam = fd.createReadStream({highWaterMark:100})


    socket.write('HTTP/1.1 200 OK\n')
    // socket.write('Access-Control-Allow-Origin: *\n')
    // socket.write('Content-Type: video/mp4\n')
    // socket.write('Content-Type: application/pdf\n')
    socket.write(`Content-Length: ${(await fd.stat()).size}\n`)
    socket.write("Content-Disposition: attachment; filename=vid.mp4;")
    socket.write('\n\n')
    // socket.write('Content-Type: text/txt; chartset=utf-8;\n')
    // socket.write(`Content-Length: ${size}\n\n`)
    // console.log('device connected '+ socket.remoteAddress)
    steam.on('data',(chunk)=>{
        socket.write(chunk)
        socket.pause()
        setTimeout(()=>{
            socket.resume()
        },1000)
    })
    socket.on('error',()=>{
        console.log('socket closed')
    })
    // steam.pipe(socket)
}))

server.listen(3000,'192.168.100.7',()=>{
    console.log('server is running')
})