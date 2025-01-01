import dgram from "node:dgram";
import fs from "node:fs";
import { pipeline } from "node:stream";
const buffer = fs.createReadStream('./img.jpg',{highWaterMark:3024});
// console.log(buffer)

const socket = dgram.createSocket('udp4');
socket.on('message',(msg, rmt)=>{
// console.log(msg)

})

buffer.on('data',(data)=>{
    socket.send(data,3000,'192.168.100.7',(msg)=>{
        // console.log(msg)
        
    })
})
buffer.on('close',()=>{
    socket.close()
})


