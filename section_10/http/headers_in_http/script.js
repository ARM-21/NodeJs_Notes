const data = await fetch('http://192.168.100.7:3000')
// console.log(data.headers)
for await(let chunk of data.body){
    console.log(chunk)
    }  

//data.headers is a iterator
// for(let i of data.headers){
//     console.log(i)
// }


//we cannot directly access them we need to allow from server to access the headers
// data.headers.forEach((key,val)=>{
// console.log(val,key)
// })
const body = document.getElementsByClassName('data')

// console.log(readet)
// body.innerHTML =  await readet.read()

console.log(body)
// for await(let i of data.body){
//     body.innerHTML = i.toString('utf-8');
   
// }

//here dat;
// a.body is readable streams which starts from \n\n
//for readable streams to get the data we use for await loop
// console.log(data.body)
 
// console.log(data)