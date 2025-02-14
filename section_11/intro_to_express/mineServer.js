import myExpress from "./myExpress.js";


const app = myExpress();


app.get('/',(req,res)=>{
    console.log('main path')
    res.end('hello main')
})
app.get('/hello',(req,res)=>{
    console.log('hello path')
    res.end('hello hello')
})

app.listen(4000,()=>{
    console.log('server is running')
})