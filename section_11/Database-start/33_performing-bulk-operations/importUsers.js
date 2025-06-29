const fs = require('fs');
const { MongoClient } = require('mongodb');

// Connection URI and database/collection names
const uri = 'mongodb://localhost:27017';
const dbName = 'test';
const collectionName = 'test';
const jsonFilePath = './users.json';

// Read the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    process.exit(1);
  }

  let docs;
  try {
    docs = JSON.parse(data);
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
    process.exit(1);
  }

  // Connect to MongoDB and insert documents
  const client = new MongoClient(uri);
  client.connect()
    .then(() => {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      return collection.insertMany(docs);
    })
    .then(result => {
      console.log(`Inserted ${result.insertedCount} documents into collection '${collectionName}'.`);
    })
    .catch(connErr => {
      console.error('Error inserting documents:', connErr);
    })
    .finally(() => {
      client.close();
    });
});
