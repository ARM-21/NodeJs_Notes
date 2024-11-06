## What is pipe method in stream?

- pipe method is alternative to handle backpressure and handle data from read stream to write stream.
- "pipe" and "unpipe" events are emitted in writable stream when pipe method is used.



## note:
pipe method doesn't have error handling mechanism. so, it is recommended to pipeline with error handling mechanism.

```js 
readStream.pipe(writeStream);
```
