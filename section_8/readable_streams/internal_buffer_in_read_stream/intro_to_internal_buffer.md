## what is internal buffer in readable Stream ?
- Internal buffer is a buffer that is used to store the data that is being read from source.
- highwatermark value decides the size of internal buffer which can be manipulated while creating the readable Stream
-read() method is used to read the content of internal buffer as desire 


## How to access the internal buffer in readable Stream ?
- Internal buffer can be accessed by using the property buffer in readable Stream

## some methods for readable Stream
- readableStream.readableBuffer
- readableStream.readableBuffer.length
-readableStream.close()
-readableStream.read()
-readableStream.on('data',callback)
-readableStream.on('end',callback)
-readableStream.on('error',callback)
-readableStream.on('close',callback)
-readableStream.on('readable',callback)
-readableStream.destroy() -> to destroy the readable Stream parameter is passed to trigger the error event


# note:
-close is the end of the readable Stream not the end
-destroy() is used to destroy the readable Stream
-
