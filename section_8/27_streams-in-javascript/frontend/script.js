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
