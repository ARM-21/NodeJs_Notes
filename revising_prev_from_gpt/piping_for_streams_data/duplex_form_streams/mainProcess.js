import {spawn} from 'child_process';



const childProcess = spawn("node",['childProcess.js'])


childProcess.stdout.on(('data'),(data)=>{
    console.log(data.toString())
})

childProcess.stdin.write("hello from parent process")
