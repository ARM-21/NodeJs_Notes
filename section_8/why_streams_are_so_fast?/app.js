import fs from "node:fs"


// import fs from "node:fs";

//time: 2.1s
// console.time()
// for(let i=0;i<=100000;i++){
//open and close the file 100000 times so it is slow

//     fs.appendFileSync('file.txt',+i+", ")
// }
// console.timeEnd()


/**note: 
 * asynchromous wtiteFile()  doesn't prints number in sequences why?
 * 
 */


///////////////////////////////////////////////////

//time:107.137ms

//opens the file once and writes the data in chunks
const writeStream = fs.createWriteStream("FromStreamNumber.txt");
console.time();

for(let i=1;i<=150000;i++){

    //when we write data to the stream it doesn't write to the file directly it writes to the buffer
  const pressure = writeStream.write(i+" ,")

   if(i == 2910){
    console.log(pressure)
    console.log(writeStream.writableLength)
       writeStream.end();
       break;

   }
}
writeStream.on("finish",()=>{
    console.timeEnd();
    console.log("Write Completed")
})