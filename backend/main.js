import express from "express";
const app = express();
import { router } from "./router.js";

app.use( "/", router );
app.listen( process.env.ANTIPLAGIAT_PORT );

process.on( "SIGINT", async() => {
    await mongoСlient.close();
    console.log( "\nServer was stopped" );
    process.exit();
} );
