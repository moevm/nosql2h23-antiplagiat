import { ObjectId } from "mongodb";
import { BaseCollection } from "./base_collection.js";

class CommitCollection extends BaseCollection
{

    constructor( db )
    {
        super( db, "commit" );
    }


    async FindByHash( hash )
    {
        return await this.collection.findOne( { _id: hash } );
    }

};

export { CommitCollection };
