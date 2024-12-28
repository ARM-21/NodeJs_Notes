import dgram from "node:dgram";

const udp = dgram.createSocket('udp4');
udp.on('message',(msg,remoteInfo)=>{
console.log(msg.toString())
})
udp.send('hello from client',40000,'192.168.100.7')