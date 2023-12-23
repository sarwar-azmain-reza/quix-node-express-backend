import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config()

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.bz2bbta.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const database = client.db("quiz-app")


export default database;
