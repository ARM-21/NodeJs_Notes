console.time()
for(let a =1;a<100000000;a++){
    if(a % 50000000 == 0){
        console.log(a)
    }
}
console.timeEnd()
