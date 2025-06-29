import { MongoClient } from "mongodb"


/**Crud operation using nodejs */

const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

await client.connect()

const test = client.db('test');

//create
test.collection('dummy').insertOne({name:'hello'})
test.collection('dummy').insertOne({name:'hello2'})
const coll  = test.collection('dummy')

// //read
const readData =await test.collection('dummy').find().toArray();
console.log(readData)

// //update

const update = await test.collection('dummy').updateMany({name:'hello2'},{$set:{name:'newhello'}})
console.log(update)


// //read
const readDataAfterUpdate =await  test.collection('dummy').find().toArray();
console.log(readDataAfterUpdate)



//delete

const deletedata = await test.collection('dummy').deleteMany({name:'newhello'})

console.log(deletedata)


//read
const readDataAfterDelete =await test.collection('dummy').find().toArray();
console.log(readDataAfterDelete)
client.close()

