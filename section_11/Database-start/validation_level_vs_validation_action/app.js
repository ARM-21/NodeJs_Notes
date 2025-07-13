import {MongoClient} from "mongodb";



const url = "mongodb://127.0.0.1:27017/test"
const client = new MongoClient(url)
await client.connect()

const db = client.db()
/**In this case, validation level is strict and validation action is error
 * 
 * 
 */

/**
 * to modify the validation level and validation action
 * const res = await collection.command({collMod:"dummy",validationAction:'warn',validationLevel:'moderate'})
 */
// const res = await db.command({collMod:"dummy",validationAction:'warn',validationLevel:'moderate'})

const collection = db.collection("dummy");

const resIns = await collection.insertOne({name:"manoj",age:"hel"})

console.log(resIns)
client.close()
