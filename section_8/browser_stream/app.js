import http from "node:http";
import fs from "node:fs/promises";


const ser = http.createServer(async (req,res)=>{
    const read = await fs.open("/home/arm-21/Videos/vid.mp4","r")
    const len = (await read.stat()).size
    console.log(len)
    res.setHeader("Content-Length",len)
    res.setHeader("allow-access-control-origin","*")
    res.setHeader("Content-Type","video/mp4")
    res.setHeader("Content-Disposition","inline; filename=vid.mp4")
    res.setHeader("Content-Range",`bytes 0-${len}/${len}`)
    const readstr =  read.createReadStream({highWaterMark:10 * 1024 * 1024 })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    readstr.on("data",(chnk)=>{
        
       const full = res.write(chnk)
    //    console.log(full)
    //    if(!full){
    
           readstr.pause()
           setInterval(()=>{
            readstr.resume()    
              },1000)
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