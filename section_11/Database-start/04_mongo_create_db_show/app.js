import fs from "node:fs"


fs.readFile('expense.json',(err,data)=>{
    console.log(typeof (JSON.parse(data.toString())))
})