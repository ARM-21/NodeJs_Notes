import { Socket } from "node:dgram"
import net from "node:net"

const connection = net.createServer()
connection.listen(4000,'192.168.100.7',(cdata)=>{
console.log("server started")
})

connection.on('connection',(soc)=>{
    soc.on('data',(data)=>{
        console.log(data.toString())
        soc.write('EOF')
    })
})