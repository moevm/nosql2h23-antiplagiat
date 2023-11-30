import express from "express";
import cors from "cors";
import { router } from "./router.js";
import * as Db from "./db.js";

const app = express();

app.use(express.json())

app.use( cors( {
    credentials: true,
    origin: "http://localhost:8080",
    methods: [ 'GET', 'POST', 'OPTIONS' ]
} ) );
app.use( "/", router );
app.listen( process.env.ANTIPLAGIAT_PORT );

process.on( "SIGINT", async() => {
    await Db.mongoClient.close();
    console.log( "\nServer was stopped" );
    process.exit();
} );
