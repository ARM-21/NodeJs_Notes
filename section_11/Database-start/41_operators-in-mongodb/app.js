import {MongoClient,Db} from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/drive_db");

await client.connect();

const db:Db = client.db();

const collection = db.collection('users');
const res = await collection.find({
    $or:[{username:"manoj"},{username:"test"}]
},{username:1}).toArray()
console.log(res)
// console.log(await db.command({listCollections:1}))


client.on('connectionCreated',()=>{
console.log("connection created")
})
db.createCollection()
client.on("error",()=>{
    client.close()
    console.log("error occured")
})
client.close()