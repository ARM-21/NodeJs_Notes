import express from 'express';
const port = 4000;
const app = express();


//route specific middleware
/**use() provide the functionality to create global or route specific middleware */

//comparison like req.url.startsWith(route)
/**note: not exacly startsWith()  instead the url is divided into several level like /user,/1 and each level is check with the route's each level*/
//it will run for every request because of comparison style used in use() method
// app.use('/',express.json())
// //route to handle /home related request url
// //comparision like this req.url == route
// app.get('/home',(req,res)=>{
//     res.end('home page')
// })
// //route to handle /home related request url
// // comparison like this req.url == route
// app.post('/home/user',(req,res,next)=>{
//     console.log(req.body)
//     res.end('posted sucessfully')
// })

// app.listen(port,()=>{
//     console.log('server is running at '+ port)
// })


/**just curious */

let users = [
	{ id: 1, name: 'alice' },
	{ id: 2, name: 'bob' },
	{ id: 3, name: 'chuck' }
];

app.use(express.json())

app.get('/users',(req,res)=>{
    res.json(users)
})

app.get('/users/:id',(req,res)=>{
    console.log(req.params.id)
    const user = users.find((user)=>user.id == req.params.id)
    if(!user){
        res.end('User not found')
        return
    }
    res.json(user)
})
app.post('/users/',(req,res)=>{
    if(!req.body.name || !req.body.id){
        res.end('give valid name or id');
        return
    }
    const doesExists = users.findIndex((user)=>user.id == req.body.id)
    if(doesExists > -1){
        res.end('user already exists')
        return
    }
    users.push(req.body)
        res.json({success:true})
    
})
app.put('/users/:id',(req,res)=>{
    const userIndex = users.findIndex((user)=>user.id == req.params.id)
    if(userIndex == -1){
        res.end('User not found')
        return
    }
    users[userIndex].name = req.body.name;
    res.json('successfully updated')
})

app.listen(port,()=>{
    console.log('server is running at '+ port)
})


