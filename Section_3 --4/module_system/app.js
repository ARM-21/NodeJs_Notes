// var isThisGlobal = 1;
// console.log(isThisGlobal)

var {sum,products} = require('./math');
// console.log(sum(1, 2));
// console.log("product",products(1, 2));

//should carefully use module.exports and exports


/**lets explore module object */

// console.log(module);
console.log(module.isPreloading);