import { MongoClient } from "mongodb";


const url = 'mongodb://localhost:27017'
const client = new MongoClient(url);


const test = client.db('test');


const collectionGot  = test.collection('dummy')

console.log(collectionGot.find());
//read available collection
const listCollections = await test.listCollections().toArray()
console.log(listCollections) //dummy


//reading all the documents
const collection = test.collection('dummy');
 const availableDocuments = await collection.find().toArray()
console.log(availableDocuments)


//filtering

console.log(await collection.find({name:'hello'},{name:1}).toArray())