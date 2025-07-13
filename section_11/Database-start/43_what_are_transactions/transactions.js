import {MongoClient} from "mongodb"
const url = "mongodb://localhost:27017/test"

const client = new MongoClient(url)

await client.connect()

const db = client.db("test");

const directory = await db.collection("dir");
const user = await db.collection("users")

const session = client.startSession()

//this will be creating a issue like failing in one and inserting one
/**to resolve we will use transactions */
session.startTransaction()

//session object needs to be passed as a second parameter, it indicated those the operation that needs to be done
const insertResDir = await directory.insertOne({name:"test1"},{session})
const insertUserDir = await user.insertOne({name:"test2"},{session})
await session.commitTransaction()


console.log(insertUserDir, insertResDir)