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
