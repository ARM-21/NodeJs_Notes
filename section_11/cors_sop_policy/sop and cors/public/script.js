const res = await fetch('http://localhost:4000/api',{
    method:"PUT"
})

console.log(await res.json())