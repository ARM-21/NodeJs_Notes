## what are streams in nodejs?
Streams are objects that let you read data from a source or write data to a destination in continuous fashion. 
# In Node.js, there are four types of streams:
- Readable: Used for reading operations.
- Writable: Used for write operations.
- Duplex: Used for both read and write operations.
- Transform: A type of duplex stream where the output is computed based on input.


In simple terms, streams is a way which provides mechanism to divide a large data into small chunks and process them piece by piece.
chunks are basically a buffer of data.

## what is buffer in nodejs?
A buffer is a temporary storage area in memory that holds data before it is processed. Buffers are used to store binary data, such as images, audio, video, and other types of files. Buffers are useful for reading and writing data in Node.js, as they provide a way to work with binary data in a more efficient manner.

## what are the advantages of using streams?
Streams are advantageous in many ways:
- Memory efficient: Streams let you read or write data piece by piece, without storing it in memory.
- Time efficient: Streams are event-based, so they can process data as it is available, without waiting for the entire data to be read or written.
- Easy to use: Streams are easy to use and implement in Node.js, with a simple and consistent API.


## Explanation of each type of stream in nodejs:

### Readable Streams:
- Readable streams are used for reading data from a source, such as a file, network, or standard input.

# Note:-
- streams are build upon event emitters, so you can listen to events like data, end, and error.