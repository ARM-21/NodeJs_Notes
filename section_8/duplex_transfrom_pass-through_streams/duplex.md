## what  is duplex stream
- Duplex streams are streams that implement both the Readable and Writable interfaces.
-fs module doesn't provide a duplex stream, but you can create one using the `Duplex` class from the `stream` module.

## There are two types of duplex streams:
- Transform streams: These are duplex streams where the output is computed based on the input.
- Pass-through streams: These is special case in transform stream where the output is the same as the input.

## Example of duplex stream
```javascript
const { Duplex } = require('stream');
```

## Example of pass-through duplex stream
```javascript
const { PassThrough } = require('stream');

```

## Example of transform duplex stream
```javascript
const { Transform } = require('stream');

```
- A Duplex stream can be thought of a readable stream with a writable stream. Both are independent and each have separate internal buffer. The reads and writes events happen independently.

                             Duplex Stream
                          ------------------|
                    Read  <-----               External Source
            You           ------------------|   
                    Write ----->               External Sink
                          ------------------|
            You don't get what you write. It is sent to another source.
- A Transform stream is a duplex where the read and write takes place in a causal way. The end points of the duplex stream are linked via some transform. Read requires write to have occurred.

                                 Transform Stream
                           --------------|--------------
            You     Write  ---->                   ---->  Read  You
                           --------------|--------------
            You write something, it is transformed, then you read something.
