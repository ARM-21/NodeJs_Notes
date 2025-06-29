import { MongoClient } from "mongodb";


const url = 'mongodb://localhost:27017'
const client = new MongoClient(url);


await client.connect()

const db = client.db('test');


const documents =  db.collection('dummy').find()

/**cursor is an async iterator */

// for await (const doc of documents){
//     console.log(doc)
// }

while(await documents.hasNext()){
    await documents.next()
}



//starts from same position where previously left
console.log(await documents.toArray()) // -> empty array
