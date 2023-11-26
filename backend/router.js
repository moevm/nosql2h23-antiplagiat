import { Router, json } from "express";
import { Controller } from "./controller.js";

const router = Router();
const jsonParser = json();
const controller = new Controller();

router.get( "/repos", async ( req, res ) => {
    res.send( await controller.GetAllRepos() );
} );


router.get( "/commits", async ( req, res ) => {
    res.send( await controller.GetAllCommits() );
} );


router.get( "/files", async ( req, res ) => {
    res.send( await controller.GetAllFiles() );
} );


router.get( "/checks", async ( req, res ) => {
    res.send( await controller.GetAllChecks() );
} );

export { router };
