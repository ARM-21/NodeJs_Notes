import fs, { copyFileSync } from "node:fs"
import fs2 from "node:fs/promises"
// console.dir(fs.readFileSync('./index.html','utf-8'))
// fs.readFile('./index.html',(err,data)=>{
// console.log(data.toString());
// })
// console.log("after async fs module")

//if we use setInterval over here we will know the main difference in time (sync,async)

// let b =0;
// setInterval(()=>{
//     console.log(b++)
// },1)
// console.time()
//now using promises based file system
// console.log('thsi is from promises')
// const a =  fs.readFileSync('./index.html')
// console.log('reading done');
// console.timeEnd();
// await fs2.readFile('./index.html','utf-8');
// console.log('reading done')
// console.timeEnd()
// console.log(a.toJSON())
//  const contentFromDesktop = await fs2.readFile('/home/arm-21/Desktop/readit.txt',"utf-8");

//  fs2.writeFile('./writableFile.txt',contentFromDesktop)




setInterval(()=>{
    const data = new Date();
    const time = data.toLocaleTimeString();
    console.log(time)
    fs2.writeFile('./dest.txt',time)
},1000)