import dgram from "node:dgram";
import fs from "node:fs";
import { pipeline } from "node:stream";
const buffer = fs.createReadStream('./img.jpg',{highWaterMark:3024});
// console.log(buffer)
const socket = dgram.createSocket('udp4');
socket.on('message',(msg)=>{
console.log(msg.toString())
socket.close()
})
let count =0;
buffer.on('data',(data)=>{
    socket.send(data,3000,'192.168.100.7',(msg)=>{
        // console.log(msg)
        const percentage = (count/150) *100
        count++;
        console.log(percentage.toFixed(2)+" % message sent")
    })
})
buffer.on('end',()=>{
    socket.send('EOF',3000,'192.168.100.7')
})
// buffer.on('close',()=>{
//     socket.close()
// })


