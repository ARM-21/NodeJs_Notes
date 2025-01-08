import net from "node:net";
import fs from "node:fs"
const server = net.createServer();


server.listen(4000,'192.168.100.7',(err)=>{
console.log("Server started")
})

server.on('connection',(soc)=>{
    soc.on('data',(data)=>{
            const write = fs.createWriteStream('./copied.mp4');
            write.write(data)
        
    })
})