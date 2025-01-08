import net from "node:net"

const socket = net.createConnection({port:4000,host:"192.168.100.7"})

socket.on('connect',()=>{
    console.log('server connected')
})

socket.on('data',(data)=>{
    console.log(data.toString())
})