 fetch('http://localhost:3000',{
    method:'POST',
    body:JSON.stringify({name:'manoj'})
 })
 .then(res=>res.text())
 .then(console.log);
