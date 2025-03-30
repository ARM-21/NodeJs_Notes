
const response = await fetch('http://192.168.100.7:4000',{
    credentials:"include"
})

console.log(await response.text())


//alternative
const xhr = new XMLHttpRequest()
xhr.withCredentials = true
xhr.open("GET",'http://192.168.100.7:4000');
xhr.send()