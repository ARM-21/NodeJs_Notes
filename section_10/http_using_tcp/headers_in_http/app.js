import fs from "node:fs";
import net from "node:net";

const server = net.createServer((sock)=>{
    console.log('device connected '+ sock.remoteAddress)
    // sock.write('http/1.0 200 ok\nAccess-Control-Allow-Origin:*\nAccess-Control-Expose-Headers:*\nname:hello\n\ndata')

    sock.write('HTTP/1.1 200 ok \n')
    sock.write('Access-Control-Allow-Origin: * \n')
    sock.write('Access-Control-Expose-Headers: * \n')
    sock.write('Content-Type: text/txt; charset=utf-8; \n')
    sock.write(`Content-Length: ${sock.readableLength}\n\n`)
    sock.write('❤️')
    // const read = fs.createReadStream('./num.txt') 

    // read.pipe(sock)
    sock.end()
})

server.listen(3000,'192.168.100.7',()=>{
    console.log('servr is listening')
})