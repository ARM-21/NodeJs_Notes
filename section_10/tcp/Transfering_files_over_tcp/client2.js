import net from "node:net"
import fs from "node:fs"

const client = net.createConnection({port:4000, host:'192.168.100.7'});

const fileFromServer = fs.createWriteStream('./fileFromServerFORClient2.mp4');
client.on('data',(data)=>{
    fileFromServer.write(data)
})