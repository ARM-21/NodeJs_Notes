## what is express?

express is a web application framework for nodejs.

## what is the use of express?

express is used to build web applications and APIs.

** // res.setHeader('content-type','text/html; charset=utf8;');
** res.end('hello this is from') //
-----------equivalent to = below code -----------
res.send('hello this is from')

## express is build on top of http module (example of abstracting the http module)

## the main feature of express is middleware

## What is middleware?

middleware is a function that has access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.

In simple words, middleware is a function that runs between the request and response of the server.

## there are 2 types of middleware:

1. Request handler middleware - 2 or 3 parameters (req,res,next)
2. Error handling middleware - 4 parameters (err,req,res,next)
   It executes in two conditions:
   2.1. whenever there is an error in the application
   2.2. whenever next() is called with a truthy value argument not falsy value('',false,0,null,undefined,NaN).

## what is the difference between route and request url?
   suppose you have a route like this:
    app.get('/user',function(req,res){
        res.send('hello user');
    });
    the route is '/user' and the request url is 'http://localhost:3000/user'
    so the route is the path that you define in the express application and the request url is the path that the user requests.
## Global middleware vs local middleware
   Global middleware is the middleware that is defined before the route and local middleware is the middleware that is defined in the route.
   app.use() is used to create a global middleware 
   order matters in middleware. the middlewaregfrbf     that is defined first will be executed first and to execute the next middleware you have to call next() function.


## express provides a middleware to parse the body of the request
   app.use(express.json()); // handles failure of parsing the json
   app.use(express.urlencoded({extended:true}));
   app.use(express.static('public'));

   or we can create a custom middleware to parse the body of the request
   app.use(function(req,res,next){
       let data = '';
       req.on('data',function(chunk){
           data += chunk;
       });
       req.on('end',function(){
           req.body = data;
           next();
       });
   });