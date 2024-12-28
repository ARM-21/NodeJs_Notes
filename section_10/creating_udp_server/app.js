import dgram from "node:dgram";

// const socket = dgram.createSocket('udp4');
// socket.on('message',(a,b)=>{
// console.log(a,b)
// })
// socket.on('listening',()=>{
//     console.log(socket.address())
//     console.log('listening')
// })

// socket.bind(32221)

const udp = dgram.createSocket('udp4')
udp.on('message', (msg,remoteInfo)=>{
    console.log(msg.toString('utf-8'),remoteInfo)
    udp.send('message received in server',remoteInfo.port, remoteInfo.address)
})
udp.on('listening',()=>{
    console.log('listenting', udp.address())
})
udp.bind(40000)
// udp.send('hello from lap',40000,'192.168.100.41')