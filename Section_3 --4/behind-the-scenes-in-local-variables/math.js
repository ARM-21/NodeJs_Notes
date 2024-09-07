// function sum(...a) {
//     return a.reduce((acc, val) => acc + val, 0);
//   }
//   function products(...a) {
//     return a.reduce((acc, val) => acc * val, 1);
//   }
  // console.log(module.exports)
  // module.exports ={
  //       sum,
  //       products
  // } 
  const {sum} =  loadModule("./sum.js")
  console.log(sum(1,2,3))
  sendModule.a = 5;

   console.log(module.isPreloading);
console.log(module.exports) 