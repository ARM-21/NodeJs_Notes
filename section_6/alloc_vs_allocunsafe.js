import {Buffer} from 'node:buffer';

const alloc = Buffer.alloc(4);
const unalloc = Buffer.allocUnsafe(4);



//condition for allocUnsafe to use buffer pool
/**
 * 1. buffer size must be less than buffer.poolSize / 2
 *  
 * 
 * 
 */

console.log(alloc);
console.log(unalloc)