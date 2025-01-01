import dgram from "node:dgram";
import fs from "node:fs";
const udp = dgram.createSocket('udp4');
const strm = fs.createWriteStream('./moveimg.jpg')
udp.on('message',(msg,rmt)=>{
strm.write(msg)
})
udp.bind(3000,'192.168.100.7')
udp.on('listening',()=>{
    console.log("server is listening")
})

