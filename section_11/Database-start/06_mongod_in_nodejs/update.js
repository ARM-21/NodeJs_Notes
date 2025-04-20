import { MongoClient } from "mongodb";

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri);

const db = client.db('test')

const collection = db.collection('dummy')
const ack = await collection.updateOne({name:'day1'},{$set:{name:'day2'}})
console.log(ack)