import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url);

await client.connect()

const db = client.db('test')

const collection = db.collection('dummy')

await collection.insertOne({name:'day2'})
await collection.insertMany([{name:'dummydata'}])