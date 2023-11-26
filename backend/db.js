import { MongoClient } from "mongodb";
import { RepoCollection, CommitCollection, FileCollection, CheckCollection } from "./collections/main.js";

const mongoСlient = new MongoClient( "mongodb://" + process.env.ANTIPLAGIAT_DB_HOST );

( async () => {
    try {
        await mongoСlient.connect();
        console.log( "Connected to database" );
    }
    catch( err ) {
        return console.log( err );
    }
} )();

const database = mongoСlient.db( process.env.ANTIPLAGIAT_DB_NAME );

const repoCollection    = new RepoCollection( database );
const commitCollection  = new CommitCollection( database );
const fileCollection    = new FileCollection( database );
const checkCollection   = new CheckCollection( database );

export {
      mongoСlient
    , repoCollection
    , commitCollection
    , fileCollection
    , checkCollection
};
