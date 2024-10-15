const bufferData = new Uint8Array(5);


bufferData[0] = 0x004D;
bufferData[1] =65;
bufferData[2] = 0x006E;
bufferData[3] = 0x006F;
bufferData[4] = 0x006A;


// for(let i=0;i<bufferData.length;i++){

//     console.log(String.fromCharCode(bufferData[i]))

// }

const decoder = new TextDecoder();
console.log( decoder.decode(bufferData))