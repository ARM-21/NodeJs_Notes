#!/usr/bin/env node
import { readFile, writeFile,appendFile } from "node:fs/promises";
const argumnts = process.argv;

const filePath = argumnts[2];
const destinationPath = argumnts[3];

try {
    const contentOfFile = await readFile(filePath, 'utf-8');
    const checkIfContentAvai = await readFile(destinationPath ,'utf-8')
    if(checkIfContentAvai.length == 0){
    writeFile(destinationPath,contentOfFile);

    }
    else{
        appendFile(destinationPath,'\n'+contentOfFile)
    }


} catch (err) {
    console.log("format : filename destination ")
    console.log("make sure your file path is correct?")
}