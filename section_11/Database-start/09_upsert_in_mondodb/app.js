import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017/test';
const client = new MongoClient(url);
await client.connect()

const db = client.db()
const collection = db.collection('users');
// await collection.insertOne({name:"manoj"})

await collection.updateOne({name:'hello'},{$set:{age:12}},{upsert:true})
client.close()
client.on('connectionCreated',()=>{
    console.log("connected")
})