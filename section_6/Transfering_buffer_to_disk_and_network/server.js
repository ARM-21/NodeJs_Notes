import http from "http"

const bufferData = new Uint8Array(5);


bufferData[0] = 0x004D;
bufferData[1] =65;
bufferData[2] = 0x006E;
bufferData[3] = 0x006F;
bufferData[4] = 0x006A;
function createServer(data){

const httpServer = http.createServer((req,res)=>{

    if(req.url =='/favicon.ico'){
        res.end()
        return;
    }
    res.end(data)

});

httpServer.listen(3000,()=>{
    console.log("server running")
})

}

createServer(bufferData)