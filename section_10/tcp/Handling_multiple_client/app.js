import { Socket } from "node:dgram"
import net from "node:net"

const connection = net.createServer()
connection.listen(4000,'192.168.100.7',(cdata)=>{
console.log("server started")
})
const clients = []
let id = 1011;
connection.on('connection',(soc)=>{
    clients.push({id:id,socket:soc,name:`client${id}`})
    console.log("<-------------------------------------------------------------->")
    clients.forEach((val)=>{
        val.socket.on('data',(data)=>{
            console.log(val.id, val.name, `\nmessage: ${data.toString()}`)
        })
        console.log("choose " +val.id + " is Online")
    })
   console.log("<-------------------------------------------------------------->")
    console.log("format:" , "client name" , "message \n")

   
    id++;
   
})
process.stdin.on('data',(data)=>{
    
    const clientName = data.toString().split(' ');
    if(clientName[0] == '0000'){
        clients.forEach((val)=>{
            val.socket.write( clientName.slice(1).join(' ').toString())
        })
    }
    const clientSocket = clients.filter((val)=>{
        return val.id == clientName[0];
    })
    clientSocket.forEach((val)=>{
        val.socket.write( clientName.slice(1).join(' ').toString())
    })
})