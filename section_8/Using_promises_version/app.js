import fsp from "node:fs/promises"

//we are using same as file descriptor as in synchronous method but it provides additional methods along with file descriptor

const st = await fsp.open("file.txt","r+");
// console.log(st)

// const {buffer} = await st.read({buffer:Buffer.alloc(10)})
// console.log(buffer)

// const {bytesWritten,buffer : hee } = await st.write(Buffer.from('hello'))
// console.log(bytesWritten)
// console.log(hee)
// st.close()


/**streams */
const read = st.createReadStream('file.txt');
read.on('data',(chnk)=>{
console.log(chnk)
})
const write = st.createWriteStream('file.txt');
write.write('helllllllllllllll')