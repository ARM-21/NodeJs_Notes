import path from "node:path";

console.log(path.join("/","./tax/../../"))


//into normal form removes unecessary part
console.log(path.normalize("./name/../.."))


console.log(path.resolve("form","to"))
console.log(path.resolve("./to"))

//converts the to to an absolute path by joining form

//from whereever we are executing
console.log(path.basename('name/images/hello.png')) //hello.png
console.log(path.dirname('name/images/hello.png')) //name/images