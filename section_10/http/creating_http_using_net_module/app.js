import net from "node:net";
import fs from "node:fs";


const server = net.createServer();

server.listen(4000,'192.168.100.7',()=>{
    console.log('server started')
})

server.on('connection',(socket)=>{
    socket.write('HTTP/1.1\n\n data to the client')
    console.log('client connected')

    const read = fs.createReadStream('/home/arm-21/Desktop/vid.mp4');
    read.pipe(socket);
})