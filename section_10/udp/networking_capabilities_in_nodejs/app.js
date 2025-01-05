import dgram from "node:dgram";//udp
import net from "node:net" // tcp
import http from "node:http";
import https from "node:https"
import dns from "node:dns";
import os from "node:os"
///we can see network interfaces in node js same as 
console.log(os.hostname())
const endianess = os.endianness();
console.log(endianess)
const cpus = os.cpus()
console.log(cpus)
console.log(os.networkInterfaces())


