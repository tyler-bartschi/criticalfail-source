const {MongoClient} = require('mongodb');
const config = require("./dbConfig.json");

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('criticalfail-test');
const userCollection = db.collection("users-test");


// switch to supabase