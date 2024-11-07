import fs from "node:fs"
// console.log('hello this is going to written in stout of child process not in terminal')

// process.stdin.on('data', (data) => {    
//     console.log(data.toString());
//     process.stdout.write('{"@timestamp":"2021-08-25T14:00:00.000Z","message":"Hello, World!"}\n');
// } )

//passing vid from child to parent
const readVid = fs.createReadStream("/home/arm-21/Videos/vid.mp4");

readVid.pipe(process.stdout)
