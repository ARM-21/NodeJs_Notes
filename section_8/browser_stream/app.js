import http from "node:http";
import fs from "node:fs/promises";


const ser = http.createServer(async (req,res)=>{
    const read = await fs.open("package.json","r")
    res.setHeader("allow-access-control-origin","*")
    res.setHeader("Content-Type","text/txt")
    const readstr =  read.createReadStream({highWaterMark:1})
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    readstr.on("data",(chnk)=>{
        
       const full = res.write(chnk)
       console.log(full)
    //    if(!full){
    
           readstr.pause()
           setInterval(()=>{
            readstr.resume()    
              },100)
    //    }
    })
    // res.on("drain",()=>{
    //     setInterval(()=>{
    //         readstr.resume()
    //     },2000)
    //     // readstr.resume()
    // })

    // res.write("hello")


    // readstr.pipe(res)

    // res.end()
    readstr.on("end",()=>{
        res.end()
        read.close()
    })
    // read.close()

})

ser.listen(3000,()=>{
    console.log("server is running")
}   )