import {MongoClient} from "mongodb";

const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
await client.connect()
client.on('commandStarted', started => console.log(started));
const db = client.db('test')
// console.log(await db.collections())
const collection = db.collection('dummy');


//it always returns cursor not the actual code it doesn't make any db call
const cursor = collection.find();
collection.insertOne({name:"manoj"})
console.log(await collection.find({name:"manoj"}).toArray())
console.log(await cursor.toArray())

client.close()


