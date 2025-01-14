import { open } from "node:fs/promises";
import net from "node:net";


const server = net.createServer(async (socket)=>{
    // const fd = await open('/home/arm-21/Desktop/vid.mp4');
    // const {size}=await fd.stat()
    // const steam = fd.createReadStream();
    const fd = await open('/home/arm-21/Documents/manoj_neupane_resume.pdf')
    const steam = fd.createReadStream()

    socket.write('HTTP/1.1 200 OK\n')
    socket.write('Access-Control-Allow-Origin: *\n')
    // socket.write('Content-Type: video/mp4\n')
    // socket.write('Content-Type: application/pdf\n')
    // socket.write(`Content-Length: ${(await fd.stat()).size}\n`)
    socket.write("Content-Dispostion: attachment; filename=manoj.pdf;")
    socket.write('\n\n')
    // socket.write('Content-Type: text/txt; chartset=utf-8;\n')
    // socket.write(`Content-Length: ${size}\n\n`)
    console.log('device connected '+ socket.remoteAddress)
    steam.pipe(socket)
    // socket.end()
})
server.on('error',()=>{
    console.log('error occured at server')
})

server.listen(3000,'192.168.100.7',()=>{
    console.log('servr started')
})

