import http from 'http';


export default function myExpress(){
    const server = http.createServer();
    return {
        get:function get(path,callback){
            server.on('request',(req,res)=>{
                if(req.method == 'GET'){
                    if(req.url == path){
                        
                        callback(req,res)
                    }
                }
            })
        },
        listen:function listen(port,callback){
            server.listen(port,callback)
        }
    }
}