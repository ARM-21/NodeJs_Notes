
console.log("how is it going?")


process.stdin.on("data", (data) => {    
    console.log(data.toString());
})