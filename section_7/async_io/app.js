import fspromises from "node:fs/promises"
import fssync from "node:fs";
let count = 1;
setTimeout(()=>{
    console.log(count++)
},1)

//sync
const syncData = fssync.writeFileSync('sync.txt','hello this a me')


//async

const asyncData = fspromises.writeFile('async,txt','data')