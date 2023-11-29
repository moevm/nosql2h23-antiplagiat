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
        return await this.collection.findOne( { _id: id } );
    }

};

export { FileCollection };
