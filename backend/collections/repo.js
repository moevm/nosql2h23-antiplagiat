import { ObjectId } from "mongodb";
import { BaseCollection } from "./base_collection.js";

class RepoCollection extends BaseCollection
{

    constructor( db )
    {
        super( db, "repo" );
    }

    async FindOne( name )
    {
        return await this.collection.findOne( { name: name } );
    }

};

export { RepoCollection };
