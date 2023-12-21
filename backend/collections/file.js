import { ObjectId } from "mongodb";
import { BaseCollection } from "./base_collection.js";

class FileCollection extends BaseCollection
{

    constructor( db )
    {
        super( db, "file" );
    }


    async FindById( id )
    {
        return await this.collection.findOne( { "_id": new ObjectId( String( id ) ) } );
    }


    async FindManyByIds( ids, projSettings = {} )
    {
        return await this.collection.find( { "_id":
            { "$in": ids.map( ( id ) => new ObjectId( id ) ) }
        } ).project( projSettings ).toArray();
    }


    async BulkUpdate( files )
    {
        let bulk = [];
        for ( const file of files )
        {
            bulk.push( {
                updateOne: {
                    filter: { name: file.name, commit: file.commit },
                    update: { $set: file, $setOnInsert: { "checks": [] } },
                    upsert: true
                }
            } );
        }
        return await this.collection.bulkWrite( bulk );
    }


    async BulkUpdateById( files )
    {
        let bulk = [];
        for ( const file of files )
        {
            bulk.push( {
                updateOne: {
                    filter: { _id: file._id },
                    update: { $set: file },
                    upsert: true
                }
            } );
        }
        return await this.collection.bulkWrite( bulk );
    }
};

export { FileCollection };
