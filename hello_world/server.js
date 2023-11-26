const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const app = express();
const json_parser = express.json();

const mongo_client = new MongoClient("mongodb://" + process.env.ANTIPLAGIAT_DB_HOST);


(async () => {
    try {
        await mongo_client.connect();
        app.locals.collection = mongo_client.db("test").collection("users")
        app.listen(process.env.ANTIPLAGIAT_PORT);
        console.log("Server has started");
    }
    catch(err) {
        return console.log(err);
    } 
})();


app.get("/api/users", async(req, res) => {
    const collection = req.app.locals.collection;
    try {
        const users = await collection.find({}).toArray();
        res.send(users);
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500);
    }  
});


app.get("/api/users/:id", async(req, res) => {
    const collection = req.app.locals.collection;
    try {
        const id = new ObjectId(req.params.id);
        const user = await collection.findOne({_id: id});
        if(user) {
            res.send(user);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});


app.post("/api/users", json_parser, async(req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const user_name = req.body.name;
    const user_age = req.body.age;
    const user = {name: user_name, age: user_age};

    const collection = req.app.locals.collection;

    try {
        await collection.insertOne(user);
        res.send(user);
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});


app.delete("/api/users/:id", async(req, res) => {
    const collection = req.app.locals.collection;
    try {
        const id = new ObjectId(req.params.id);
        const user = await collection.findOneAndDelete({_id: id});
        if (user) {
            res.send(user);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});


app.put("/api/users", json_parser, async(req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }
    const user_name = req.body.name;
    const user_age = req.body.age;

    const collection = req.app.locals.collection;
    try {
        const id = new ObjectId(req.body.id);
        const user = await collection.findOneAndUpdate({_id: id}, { $set: {age: user_age, name: user_name}},
            {returnDocument: "after" });
 
        if (user) {
            res.send(user);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});


process.on("SIGINT", async() => {
    await mongo_client.close();
    console.log("\nServer was stopped");
    process.exit();
});