#!/usr/bin/env node

import fs from "node:fs/promises"
const filePath = process.argv[2];

const content = await fs.readFile(filePath,'utf-8');

const wordKey = content.split(/[\W]/).filter((w)=>w);
const object = {}

wordKey.map((word)=>{
    if(word in object){
        object[word] = object[word] +1;
    }
    else{
        object[word] = 1
    }
})


if(process.argv.length == 4){
    const word = process.argv[3];
    if( word in object){
        console.log(object[word])
    }
    else{
        console.log("word_not_found")
    }
}
else{
console.log(object)
}
