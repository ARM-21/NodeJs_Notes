import net from "node:net"
import fs, { readFile } from "node:fs"
import { pipeline } from "node:stream"
import { type } from "node:os"
const client = net.createConnection({port:4000,host:'192.168.100.7'})

client.on('connect',()=>{
    console.log("server connected")
    
})
const a = "he"

process.stdin.on('data',(data)=>{
    const inpt = data.toString()
    console.log(typeof inpt)
    console.log(inpt == "send")
    if(inpt === "send"){
        console.log("sending started")
        const read = fs.createReadStream("/home/arm-21/Desktop/vid.mp4")
        pipeline(read, client)
    }
})