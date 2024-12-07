const input = document.querySelector("input");
const decoder = new TextDecoder("utf-8");
input.addEventListener("change", async () => {
  // console.dir(input)
  const file = input.files[0];
  console.log(file);
  //we can use text() method to read the file
  // console.log(await file.text());

  //we should use stream to get the strean of the file
  //we cann't set highWaterMark in the stream browser will set it automatically
  const strean = file.stream();
  console.log(strean);
  for await(const chunk of strean) {
    console.log(decoder.decode(chunk))

  }

  //to read the stream we need to get a reader first
  // const reader = strean.getReader();

  //now we can read the stream

  //it read a big chunk of the file (it doesn't read like in node js) instead reads a chunk and done (done property inddicates whether the file content or not (true/false))l
// const readedContent = await  reader.read()
// console.log(readedContent.value)
// console.log(decoder.decode(readedContent.value))

}); 


const data = await fetch("http://localhost:4000")
const image = data.blob()
// const file = new File([image], "image.webp")
const urlimage = new URL(image)
const url = urlimage.createObjectURL(urlimage)
const div = document.createElement("div")
div.innerHTML = `<img src="${url}" alt="image">`
document.body.append(div)
// const b = new Blob()
// for await (const chnk of data.body) {
// console.log(decoder.decode(chnk))
// // }
// const reader =  data.body.getReader()
// while(true){
//   const {value, done} = await reader.read()
//   if(done) break;
//   console.log(decoder.decode(value))
// }

// console.log(data)

