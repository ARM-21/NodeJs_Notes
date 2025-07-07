/**
 * when we mistake insert a document with a id that already exists in a database then it will create a duplicate key error
 * and stops inserting data behind that while insert many data together
 * insertMany will not insert any data if one of the document has a duplicate key error
 * * to avoid this we can use ordered: false in insertMany
 *  */
import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/test';
const client = new MongoClient(url);
await client.connect()

const db = client.db();
const collection = db.collection('test');

const res = await  collection.insertMany([
  { _id: 1, name: 'Alice' },
  { _id: 2, name: 'Bob' },
  { _id: 3, name: 'Charlie' },
  { _id: 1, name: 'David' } // This will cause a duplicate key error
], { ordered: false }) // Using ordered: false to allow insertion of other documents even if one fails

