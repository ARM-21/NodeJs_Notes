
//this a one way to create a typed array
const a  = new ArrayBuffer(4);

const typed = new Int8Array(a);
 console.log(typed)


 //another way is here:-

 //typed array automatically creates the buffer array automatically 
 //don't need to create a arrayBuffer explicitily

 const newWay  = new Int8Array([1,2,3,4]);

 console.log(newWay)


 //we can create a resizable arraybuffer using {maxByteLenght:value} --> this sets resizable to true if the initial size is less than max byte