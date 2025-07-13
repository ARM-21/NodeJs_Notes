import { MongoClient, Db } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/test");


try {
    await client.connect();

    const db = client.db();

    // const collection = await db.command(
    //     {
    //         collMod: "dummy",
    //         validator: {
    //             $jsonSchema: {
    //                 bsonType: 'object',
    //                 properties: {
    //                     _id: {
    //                         bsonType: 'objectId'
    //                     },
    //                     name: {
    //                         bsonType: 'string',
    //                         minLength: 3,
    //                         maxLength: 10
    //                     },
    //                     hobbies:{
    //                         bsonType:"array",

    //                     },
    //                     age: {
    //                         bsonType: 'int'
    //                     }
    //                 },
    //                 additionalProperties: false,
    //                 required: [
    //                     'name',
    //                     'age',
    //                     'hobbies',
    //                 ]
    //             }
    //         }
    //     }
    // )

    const collection = db.collection('dummy');

   const res =  await collection.insertOne({
        name: "manoj",
        age: "man",
        hobbies: ["coding", "reading"]
    })
    console.log(res)
    client.close()
}
catch (err) {
    console.log(err)
    client.close()
}



