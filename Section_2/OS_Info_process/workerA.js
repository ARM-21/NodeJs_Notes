console.time()
for(let a =1;a<10000000000;a++){
    if(a % 5000000000 == 0){
        console.log(a)
    }
}
console.timeEnd()
