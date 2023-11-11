const Surreal  = require('surrealdb.js').default;

const db = new  Surreal();

async function connect_surreal_db(){
   
    try {
        await db.connect('http://127.0.0.1:8080/rpc');

        await db.signin({
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        });

        await db.use({namespace:'EVENT_CONTRACT', database:'event_db1'});


    } catch (error) {
        return new Error("Database connection failed");
    }
}

connect_surreal_db()
module.exports =  db;