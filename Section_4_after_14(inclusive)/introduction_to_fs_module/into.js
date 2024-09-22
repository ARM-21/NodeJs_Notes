import fs from "node:fs"
import fs2 from "node:fs/promises"
console.dir(fs.readFileSync('./index.html','utf-8'))
fs.readFile('./index.html',(err,data)=>{
console.log(data.toString());
})
console.log("after async fs module")


//now using promises based file system
console.log('thsi is from promises')
const a = await fs2.readFile('./index.html');
console.log(a.toJSON())

