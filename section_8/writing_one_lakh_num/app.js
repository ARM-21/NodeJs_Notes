import fs from "node:fs";

//time: 2.1s
// console.time()
// for(let i=0;i<=100000;i++){

//     fs.appendFileSync('file.txt',+i+", ")
// }
// console.timeEnd()


/**note: 
 * asynchromous wtiteFile()  doesn't prints number in sequences why?
 * 
 */


///////////////////////////////////////////////////

//time:107.137ms
const writeStream = fs.createWriteStream("FromStreamNumber.txt");
console.time();

for(let i=1;i<=100000;i++){
   writeStream.write(i+" ,")

   if(i == 100000){
       writeStream.end();

   }
}
writeStream.on("finish",()=>{
    console.timeEnd();
    console.log("Write Completed")
})