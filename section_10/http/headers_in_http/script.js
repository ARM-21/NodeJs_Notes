const data = await fetch('http://192.168.100.7:3000')
console.log(data.headers)

// for(let i of data.headers){
//     console.log(i)
// }


//we cannot directly access them we need to allow from server to access the headers
data.headers.forEach((key,val)=>{
console.log(val,key)
})

//here data.body is readable streams which starts from \n\n
//for readable streams to get the data we use for await loop
// console.log(data.body)
// for await(let chunk of data.body){
// console.log(chunk)
// }   
// console.log(data)