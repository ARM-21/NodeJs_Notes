import net from "node:net";

const server = net.createServer((sock)=>{
    console.log('device connected '+ sock.remoteAddress)
    sock.write('http/1.0 200 ok\nAccess-Control-Allow-Origin:*\nAccess-Control-Expose-Headers:*\nname:hello\n\ndata')
    sock.end()
})

server.listen(3000,'192.168.100.7',()=>{
    console.log('servr is listening')
})