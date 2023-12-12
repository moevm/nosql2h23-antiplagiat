import { ObjectId } from "mongodb";
import { BaseCollection } from "./base_collection.js";

class CheckCollection extends BaseCollection
{

    constructor( db )
    {
        super( db, "check" );
    }

    async FindOne( id )
    {
        return await this.collection.findOne( { "_id": new ObjectId( id ) } );
    }

};

export { CheckCollection };
