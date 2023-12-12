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


router.post( "/repo/update", ( req, res ) => {
    controller.UpdateRepo( req.name );
    res.status( 204 ).end();
} );


router.get( "/repo/list", async ( req, res ) => {
    res.send( await controller.GetAllReposBranches() );
} );


router.get( "/repo/branch", async ( req, res ) => {
    res.send( await controller.GetBranchInfo( req.query.repoId, req.query.branchName
        , { "sortBy": req.query.sortBy, "sortOrder": req.query.sortOrder } ) );
} );


/// @note Заглушка
router.post( "/repo/:repoId/check", async ( req, res ) => {
    const repoId = req.params.repoId;
    const docTypes = req.body.docTypes.split( "," );
    const compareWith = req.body.compareWith;
    const filesToCheck = req.body.filesToCheck;
    res.status( 204 ).end();
} );


router.post( "/repo/add", ( req, res ) => {
    controller.AddRepo( req.body.myUrl );
    res.status( 204 ).end();
} );


router.get( "/repo/statistics", async ( req, res ) => {
    const reqData = {
        "repoIds": req.query.repoIds?.split( "," ),
        "docTypes": req.query.docTypes?.split( "," ),
        "dateFrom": req.query.dateFrom,
        "dateTo": req.query.dateTo,
        "statisticsType": req.query.statisticsType
    };
    res.send( await controller.GetStatistics( reqData ) );
} );


router.get( "/repo/file/:fileId", async ( req, res ) => {
    res.send( await controller.GetChecks( req.params.fileId ) );
} );


router.get( "/repo/allinfo", async ( req, res ) => {
    res.send( await controller.GetStatistics( {} ) );
} );

export { router };
