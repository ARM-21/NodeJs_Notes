import { error } from "node:console";
import net from "node:net"

const client = net.createConnection({port:4000,host:'192.168.100.7'});
client.on('connect',()=>{
console.log('connected')
})

process.stdin.on('data',(input)=>{
    client.write(input)
    
})
process.on('error',()=>{
    console.log('error occured')
})

client.on('data',(data)=>{
    if(data.toString() == 'EOF'){
        process.abort()
    }
    console.log(data.toString())
})


client.on('error',()=>{
    console.log("process aborted")
})