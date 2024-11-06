#!/usr/bin/env node
 function greet(name) {
 return `Hello, ${name}!`;
}

// console.log(process.argv[2])

const userName = greet(process.argv[2]);

console.log(userName)
// export default greet;