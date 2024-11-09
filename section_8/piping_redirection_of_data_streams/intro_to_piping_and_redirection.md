## what is piping and redirection?
Piping and redirection are two powerful features of the Unix command line. They allow you to take the output of one command and use it as the input to another command. This can be very useful for chaining together multiple commands to perform complex tasks.


## what is piping?
- piping is the mechanism through which the standard output(stdout) of one process is connected to the standard input(stdin) of another process.
- piping is used for any process
- we use | to pipe the output of one command to the input of another command


## what is redirection?
- redirection is the mechanism through which the output/err/input/(1/2/0) of a process is redirected to a file.
- ridirection is used for file operations
- we use > to redirect the stream to a file -> it overwrites the file
- we use >> to append the stream to a file -> it appends the stream to the file
- we use < to reirect the stdout/output a file to the stdin/input of a process.(this is a reverse of > operation)