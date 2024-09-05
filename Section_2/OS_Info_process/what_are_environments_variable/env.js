// import {exec} from "child_process";
import fs from "node:fs"
// const env = process.env;
// console.log(env)


//We use exec from our child_process to execute a command in terminal from node
// exec('ls',(err)=>{
//     if(err){
//         console.log(err)
//     }
// })
// console.log(h)

const content = fs.readFileSync('./abc').toString();
content.split('\n').forEach((val)=>{
const [key,value]=val.split('=');
process.env[key] = value;
});

console.log(process.env)