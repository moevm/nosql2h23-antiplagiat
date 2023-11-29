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


router.post( "/repo/add", ( req, res ) => {
    controller.AddRepo( req.url );
    res.status( 204 ).end();
} );


router.post( "/repo/update", ( req, res ) => {
    controller.UpdateRepo( req.name );
    res.status( 204 ).end();
} );


router.get( "/repo/all", async ( req, res ) => {
    res.send( await controller.GetAllReposBranches() );
} );


router.get( "/repo/files", async ( req, res ) => {
    res.send( await controller.GetBranchFiles( req.query.repoName, req.query.branchName ) );
} );

export { router };
