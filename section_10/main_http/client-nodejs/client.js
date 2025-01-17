import http from "node:http";

const client = http.request({host:'192.168.100.7',port:4000,path:'/',method:'post'})

client.end('from client')

client.on('response',(response)=>{
    response.on('data',(chnk)=>{
        console.log(chnk.toString())
    })
})