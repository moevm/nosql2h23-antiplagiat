import express from "express";
import { router } from "./router.js";
import * as Db from "./db.js";

const app = express();

app.use( "/", router );
app.listen( process.env.ANTIPLAGIAT_PORT );

process.on( "SIGINT", async() => {
    await Db.mongoClient.close();
    console.log( "\nServer was stopped" );
    process.exit();
} );
