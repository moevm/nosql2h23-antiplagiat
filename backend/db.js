import { MongoClient } from "mongodb";
import { RepoCollection, CommitCollection, FileCollection, CheckCollection } from "./collections/main.js";

const mongoClient = new MongoClient( "mongodb://" + process.env.ANTIPLAGIAT_DB_HOST );

( async () => {
    try {
        await mongoClient.connect();
        console.log( "Connected to database" );
    }
    catch( err ) {
        return console.log( err );
    }
} )();

const database = mongoClient.db( process.env.ANTIPLAGIAT_DB_NAME );

const repoCollection    = new RepoCollection( database );
const commitCollection  = new CommitCollection( database );
const fileCollection    = new FileCollection( database );
const checkCollection   = new CheckCollection( database );

export {
      mongoClient
    , repoCollection
    , commitCollection
    , fileCollection
    , checkCollection
};
