import { Router, json } from "express";
import { Controller } from "./controller.js";
import { readFileSync } from "node:fs";
import multer from "multer";

const router = Router();
const jsonParser = json();
const controller = new Controller();

const storage = multer.diskStorage( {
    destination: function ( req, file, cb ) {
        cb( null, '/tmp/' )
    },
    filename: function ( req, file, cb ) {
        const uniqueSuffix = Date.now() + '-' + Math.round( Math.random() * 1E9 )
        cb( null, file.fieldname + '-' + uniqueSuffix )
    }
} );
const upload = multer( { storage: storage } );

router.get( "/repos", async ( req, res ) => {
    try
    {
        res.send( await controller.GetAllRepos() );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.get( "/commits", async ( req, res ) => {
    try
    {
        res.send( await controller.GetAllCommits() );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.get( "/files", async ( req, res ) => {
    try
    {
        res.send( await controller.GetAllFiles() );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.get( "/checks", async ( req, res ) => {
    try
    {
        res.send( await controller.GetAllChecks() );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.post( "/repo/update", ( req, res ) => {
    try
    {
        controller.UpdateRepo( req.name );
        res.status( 204 ).end();
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.get( "/repo/list", async ( req, res ) => {
    try
    {
        res.send( await controller.GetAllReposBranches() );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.get( "/repo/branch", async ( req, res ) => {
    try
    {
        res.send( await controller.GetBranchInfo( req.query.repoId, req.query.branchName
            , { "sortBy": req.query.sortBy, "sortOrder": req.query.sortOrder } ) );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.post( "/repo/:repoId/check", async ( req, res ) => {
    try
    {
        const repoId = req.params.repoId;
        const docTypes = req.body.docTypes?.split( "," ) || [];
        const compareWith = req.body.compareWith || [];
        const filesToCheck = req.body.filesToCheck || [];
        if ( !await controller.LaunchCheck( repoId, filesToCheck, docTypes, compareWith ) )
        {
            res.status( 500 ).end();
            return;
        }
        res.status( 204 ).end();
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.post( "/repo/add", ( req, res ) => {
    try
    {
        controller.AddRepo( req.body.myUrl );
        res.status( 204 ).end();
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.get( "/repo/statistics", async ( req, res ) => {
    try
    {
        const reqData = {
            "repoIds": req.query.repoIds?.split( "," ) || [],
            "docTypes": req.query.docTypes?.split( "," ) || [],
            "dateFrom": req.query.dateFrom,
            "dateTo": req.query.dateTo,
            "statisticsType": req.query.statisticsType
        };
        res.send( await controller.GetStatistics( reqData ) );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.get( "/repo/file/:fileId", async ( req, res ) => {
    try
    {
        console.log( req.params.fileId, req.params.fileId.length );
        res.send( await controller.GetChecks( req.params.fileId ) );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.get( "/repo/allinfo", async ( req, res ) => {
    try
    {
        res.send( await controller.GetStatistics( {} ) );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.get( "/export", async ( req, res ) => {
    try
    {
        res.json( await controller.GetAllData() );
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );


router.post( "/import", upload.single( 'data' ), async ( req, res ) => {
    try
    {
        const fileData = JSON.parse(
            readFileSync( req.file ).toString()
        );
        await controller.PutAllData( fileData )
        res.end();
    }
    catch ( e )
    {
        console.error( e );
        res.status( 500 ).end();
    }
} );

export { router };
