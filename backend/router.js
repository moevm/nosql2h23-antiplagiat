import { Router, json } from "express";
import * as Db from "./db.js";

const router = Router();
const jsonParser = json();

router.get( "/repos", async ( req, res ) => {
    res.send( {} );
} );


router.get( "/commits", async ( req, res ) => {
    res.send( {} );
} );


router.get( "/files", async ( req, res ) => {
    res.send( {} );
} );


router.get( "/checks", async ( req, res ) => {
    res.send( {} );
} );

export { router };
