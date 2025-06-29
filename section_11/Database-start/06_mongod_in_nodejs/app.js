// console.log(show('databases'))
// console.log(use('new_db'))
// console.log(show('collections'))

// console.log(db.getCollection('fruits').find())


// import { MongoClient } from "mongodb"
// const url = 'mongodb://127.0.0.1:27017'
// const client = new MongoClient(url)
// await client.connect()

/**Above three line of code is equak to mongosh url in terminal */


// if argument is not passed inside db then it uses test database by default
// const test = client.db();

// const collections =await test.listCollections().toArray()
 
// test.collection('dummy').insertOne({name:'dummyData'})
// const database = client.db('node_db')



/**to list all the database availbale
 * 
 * const inst = client.db().admin()
const dbs  = await inst.listDatabases()
console.log(dbs)
 * 
 */



// const collection = await database.collection('sample_db').insertOne({name:"sample",roll:29});

// console.log(collection)
// const data = await database.collection('sample_db').find().toArray();

// console.log(data)
// client.close()





