import { MongoClient } from "mongodb";


export default async function getConnection() {
    const url = "mongodb://localhost:27017/drive_db";
    const client = new MongoClient(url)
    await client.connect()
    console.log("database connection successfull")
    const db = client.db()
    return db;

}

