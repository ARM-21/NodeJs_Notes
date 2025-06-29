import {MongoClient} from "mongodb";

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const db = client.db('test')


//this is similar like prepare statement in sql java
// const data = db.collection('dummy').find().limit(0).skip(0).sort({name:'ascending'})

///execution of sql query
// console.log(await data.toArray())

 console.log(await db.collection('dummy').find().toArray())