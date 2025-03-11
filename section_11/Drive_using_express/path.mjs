import path from "node:path";

console.log(path.join("/../name","/tax"))


//into normal form removes unecessary part
console.log(path.normalize("../../name"))


console.log(path.resolve("form","to"))
console.log(path.resolve("./to"))

//converts the to to an absolute path by joining form


console.log(path.basename('name/images/hello.png')) //hello.png
console.log(path.dirname('name/images/hello.png')) //name/images