
// console.log(res.headers.entries().next().value)
// const data = await res.text()
// console.log(data)


let form = document.getElementById('submit');
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(form[0].value.toLowerCase() == 'hi'){
        gatherData()
    }
})
// console.dir(form[0].value)

async function gatherData(){
    const dcoder = new TextDecoder()
    const num = document.querySelector('.numbers')
    const res = await fetch('http://192.168.100.7:3000')
    for await (const chunk of res.body){
        document.write(dcoder.decode(chunk))
        // num.innerHTML += dcoder.decode(chunk)
        console.log(chunk)
    }
}