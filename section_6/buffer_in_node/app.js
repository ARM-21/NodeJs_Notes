//creating a buffer in node js is little different from creating a buffer in browser. In node js, we can create a buffer in two ways.
//1. By using Buffer.from() method
//2. By using Buffer.alloc() method
import { Buffer, constants } from 'buffer';


//1. By using Buffer.from() method
//Buffer.from() method is used to create a buffer from a given string or array. It takes three arguments.
   //exmple
    // const buf = Buffer.from('Hello');
    // console.log(buf); //output: <Buffer 48 65 6c 6c 6f>


//from from() method memory for arrayBuffer is used more than the alloc?? why?
    const buffContent = Buffer.from('manoj');


//2. By using Buffer.alloc() method 
    const buffFromAlloc = Buffer.alloc(5).fill('manoj')
    const buffSecond = Buffer.alloc(6);

    
//we can concat two buffer using concat method which will use buffer pool
        
    const buffConcat = Buffer.concat([buffContent, buffSecond]);
    console.log(buffConcat)

    
//     console.log(buffConcat.toString())    
// console.log(buffContent.toString())
//     console.log(buffFromAlloc.toString())



/** Constants is used to know the actual maximum size for a ArrayBUffer 
 * thata can be created in node js
*/

console.log(constants.MAX_LENGTH)