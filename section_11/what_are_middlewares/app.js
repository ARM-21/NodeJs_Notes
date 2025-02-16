import express from 'express'

const app = express();

const port = 4000;

// app.get('/',
//     //request handler middleware 3 params
//     (req, res, next) => {
//         try{
//             console.log('middleware 1')
//         res.write('write from firstmiddleware\n');
//         throw new Error('this a custom error')
//         next()
//         }catch(err){
//             next(err)
//         }

//         //this next refers to the next function so whereever we call resulting in executing it
//         // throw new Error('hello this is a custom error')

//     },
//     //request handler middleware 2 params
//     (req, res) => {
//         console.log('middleware 2')
//         res.end('ended from second middleware')
//     },
//     //error handler middleware  4 params
//     (err,req,res,next) => {
//         console.log({err:err.message})
//         res.end('error found')
//     }
// )

// app.get('/home', (req, res) => {
//     console.log('this is main path')
// })

// app.listen(port, () => {
//     console.log('server is running')
// })


//**handling different requests using express */
/**checking rquestes logging */
/**custom global middleware its order matters */
// app.use((req, res, next) => {
//     console.log('global middleware')
//     req.on('data', (chnk) => {
//         const data = chnk.toString()
//         req.body = data;
//         next()
//     })
//     // res.end('global middleware')

// })

/**express middleware provide same functionality as above*/

app.use(express.json())

app.get('/', (req, res) => {
    res.end('home page')
})
/**login */
app.get('/login', (req, res) => {
    res.end('logged in successfull')
})

app.post('/', (req, res) => {
    // console.log(JSON.parse(req.body))
    // throw new Error('error generated')
    console.log( req.body)
    res.end('posted end')
})


app.listen(port, () => {
    console.log('server is running on ' + port)
})