import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/drive_db");

await client.connect();

const db = client.db();

//it returns a object which contains cursor object
/** we need to extract value from firstBatch */

//list Collection
const result = await db.command({listCollections:1});
console.log(result.cursor.firstBatch);


//list documents

const docuRes = await db.command({
    find:"users",
    filter:{username:"Manoj"}

})

console.log(docuRes.cursor.firstBatch)
client.close();
