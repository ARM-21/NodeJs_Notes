import net from "node:net";
import fs from "node:fs"
const server = net.createServer((soc)=>{
    console.log('client connected ' + soc.remoteAddress)
});

const clients = []

server.listen(4000,'192.168.100.7',(err)=>{
console.log("Server started")
})
let clientExists = true;



server.on('connection',(soc)=>{
    const num = Math.random()*1000;
   clients.forEach((client)=>{
    if(client.id != num){
        clientExists = false;
    }
   })

   if(!clientExists || clients.length == 0){
        clients.push({id:num,socket:soc})
   }
else {
    console.log('client already exists')
}
    // const write = fs.createWriteStream('./copied.mp4');
    soc.on('data',(data)=>{
            // write.write(data)
            clients.filter((client)=>{ return num != client.id }).forEach((client)=>{client.socket.write(data)})
            // write.write(data)
        
    })
    soc.on('error',()=>{
        console.log('client lost')
    })

    soc.on('end',()=>{
        console.log("done")
    })
    console.log(clients)
})

server.on('error',()=>{
    console.log('server lost')
})

