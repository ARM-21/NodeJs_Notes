import net from "node:net"

const socket = net.createConnection({'port':3000,'host':'192.168.100.7'},(err)=>{
    console.log(err)
    console.log('hello from some')
})


socket.on('connect',()=>{
    socket.write('hello from client')
    
})
socket.on('data',(data)=>{
    console.log(data.toString())
})


