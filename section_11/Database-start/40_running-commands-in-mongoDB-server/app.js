import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/newDB");

await client.connect();

const db = client.db();


const result = await db.command({ dropDatabase: 1 });

console.log(result);

client.close();
