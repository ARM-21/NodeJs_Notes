//command line arguments
process.argv;
//environment variables
process.env;
//current process id
process.pid;
//current parent process id
process.ppid;
//os platform
process.platform;
process.kill(1234);
process.exit(0);//0 or 1 --> 1 means error
process.cwd(); //current working directory
process.memoryUsage(); //memory usage of the process
process.cpuUsage(); //cpu usage of the process
process.uptime(); //time since the process started
process.versions; //versions of node and its dependencies
process.stdin; //standard input
process.stdout; //standard output
process.stderr; //standard error
process.stdin.resume();
process.stdin.pause();
process.stdin.setEncoding('utf8');

//event listeners
process.stdin.on('data', (data) => {
  console.log(data);
});
process.stdin.on('end', () => {
  console.log('end');
});

//
process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});
process.on('uncaughtException', (err) => {
  console.log('Uncaught exception: ', err);
});
process.on('beforeExit', () => {
  console.log('beforeExit event');
});
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.stack);
});
process.on('message', (message) => {
  console.log('Message from parent:', message);
});
