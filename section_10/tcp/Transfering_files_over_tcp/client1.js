import net from "node:net"
import fs, { readFile } from "node:fs"
import { pipeline } from "node:stream"
import { type } from "node:os"
import { error } from "node:console"
const client = net.createConnection({port:4000,host:'192.168.100.7'})

client.on('connect',()=>{
    console.log("server connected")
    
})
process.stdin.on('data',(data)=>{
    const inpt = data.toString().trim()
    if(inpt === "send"){
        console.log("sending started")
        const read = fs.createReadStream("/home/arm-21/Desktop/vid.mp4",{highWaterMark:5*1024*1024})
        read.pipe(client)
        read.on('close',()=>{
            console.log('done')
        })
    }
})
client.on('error',()=>{
    console.log('server lost')
    process.stdin.removeAllListeners()
    process.stdin.end()
})

client.on('connectionAttemptFailed',()=>{
    console.log('connection failed')
})
