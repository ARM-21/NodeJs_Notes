console.log('hello')

const filesPr = document.querySelector('ul')

filesPr.addEventListener('click',(e)=>{
// e.view.window = e.baseURI + `${e.textContent}`
console.log(e)
// window.location.href = e.baseURI + `${e.textContent}`

console.log(window.location.href)
})