import fs from "node:fs"


fs.readFile('expense.json',(err,data)=>{
    console.log((JSON.parse(data.toString())))
    console.log(typeof (JSON.parse(data.toString())))
})