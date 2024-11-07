## what are data streams?
    * A stream is like a pipe through which data can flow.so, there are three types of pipe on the basis of Linux/Unix:
        - `stdin` : This is a readable stream. It is used to read data from a source.
        - `stdout` : This is a writable stream. It is used to write data to a destination.
        - `stderr` : This is a writable stream. It is used to write error messages to a destination.

- terminal handles all the things using these streams. When we run a command in the terminal, 
it uses these streams to get the input, process it, and then show the output.

note - when we use console.log() in node.js, it writes the output to the stdout stream.
example:
```js
console.log('Hello World'); 
process.stdout.write('Hello World');
//console,log() behind the scene uses stdout.write() method. to write in console
```




* Each process has connection to three types of streams:
- `stdin` (standard input): This is a readable stream that represents the process's input.
    ** it is also a duplex stream, which means it can be used for both reading and writing but mostly used for reading.
- `stdout` (standard output): This is a writable stream that represents the process's output.
    ** it is also a duplex stream, which means it can be used for both reading and writing but mostly used for writing.
- `stderr` (standard error): This is a writable stream that represents the process's error output.
    ** it is also a duplex stream, which means it can be used for both reading and writing but mostly used for writing.

## Number assocaited to streams:
- `0` : stdin
- `1` : stdout
- `2` : stderr
- these number are basically the file descriptor of the streams or fd.


## IMPORTANT NOtE FOR DATA STREAMS:
- Each process has three data streams to handled particular type of data.(stdin, stdout, stderr)
- stdout of node process is connected to the stdout of the terminal.