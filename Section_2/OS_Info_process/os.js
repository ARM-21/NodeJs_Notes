import {Worker} from "worker_threads"


const a = process;
// console.log(a)

new Worker('./workerA.js')
new Worker('./workerB.js')