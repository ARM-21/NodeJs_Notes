const fileInput = document.getElementById("fileInput");
const file = document.querySelector(".image img");


// fileInput.addEventListener("change", (event) => {
//   const file = event.target.files[0];

//   const reader = new FileReader();
//   reader.addEventListener("load", function (e) {
//     const arrayBuffer = e.target.result;
//     console.log(arrayBuffer);
//   });

//   reader.readAsArrayBuffer(file);
// });
// fileInput.addEventListener('change',(e)=>{
//   const a = new  FileReader();
//   a.addEventListener('load',(e)=>{
//     console.log(e.target.result)
//   })
//   a.readAsArrayBuffer(e.target.files[0])
// })


const a = new ArrayBuffer(4);

let view = new DataView(a);

view.setInt16(0,257,true);

view.setInt16(2,257,true);