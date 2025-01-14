import { createWriteStream } from "node:fs"
import net from "node:net"
const server = net.createServer((socket)=>{
    console.log("connection with " ,socket.remoteAddress)
    const write = createWriteStream('uploaded.txt')
    socket.on('data',(chnk)=>{
        write.write(chnk)
        console.log(chnk.toString())
        if(/------WebKitFormBoundary.+--/.test(chnk.toString())){
            socket.end('HTTP/1.1 200 ok\n\ngot the data')
            console.log('yes')
        }

    })
})
server.listen(3000,'192.168.100.7',()=>{
console.log('server is running')
}
)
