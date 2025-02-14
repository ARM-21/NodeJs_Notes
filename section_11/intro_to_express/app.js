import express from "express";
import http from 'http'

const app = express();
//disable to a headers/settings
app.disable('x-powered-by')

console.log(app)

app.get('/',(req,res)=>{
    //end in http //  send in expresss

    /**end and send are little different */
    // res.setHeader('content-type','text/html; charset=utf8;');
    // res.end('hello this is from')

    /** equals to send('hello this is from') */

    res.send('hello this is from server')
})

app.listen(4000)


const server  = http.createServer(app)