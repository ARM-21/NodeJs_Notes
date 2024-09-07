//al the variables are in local like __dirname, __filename, exports, module, require
/**from where did it came? */
//it is because of the module wrapper function that is wrapping the code of the file

//examples
(function(exports, require, module, __filename, __dirname){
    function sum(...a) {
        return a.reduce((acc, val) => acc + val, 0);
      }
      function products(...a) {
        return a.reduce((acc, val) => acc * val, 1);
      }
      console.log(module.exports)
      module.exports ={
            sum, 
            products
      } 
      console.log(module.isPreloading);
    console.log(module.exports) 
})(exports, require, module, __filename, __dirname);