import fs from "node:fs"
import { spawn } from "node:child_process"
//same as this does console.log behind the scenes
// process.stdout.write('{"@timestamp":"2021-08-25T14:00:00.000Z","message":"Hello, World!"}\n');
// const writable = fs.createWriteStream('output.txt');

// process.stdin.pipe(writable)



/**standard err is same as standard output */

// process.stderr.write('{"@timestamp":"2021-08-25T14:00:00.000Z","message":"Hello, World!"}\n');

const childProcess = spawn('node',['childApp.js']);


//we are listening on the stdout of the child process (that's unsual to listen on standard ouput stream)
/**but we can do it since each  standard stream is a duplex stream */

childProcess.stdout.on('data', (data) => {
    console.log(data);
}   )

childProcess.stdin.write("hello from parent process\n");



