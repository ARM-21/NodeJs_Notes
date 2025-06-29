import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url);

await client.connect()

const db = client.db('test')

await db.collection('dummy').deleteOne({name:'day2'});