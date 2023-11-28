import { ObjectId } from "mongodb";
import { BaseCollection } from "./base_collection.js";

class CheckCollection extends BaseCollection
{

    constructor( db )
    {
        super( db, "check" );
    }

};

export { CheckCollection };
