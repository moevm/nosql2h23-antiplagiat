import { ObjectId } from "mongodb";

class CheckCollection
{
    constructor( db )
    {
        this.collection = db.collection( "check" );
    }

    async FindAll()
    {
        const records = await this.collection.find( {} ).toArray();
        return records;
    }
};

export { CheckCollection };
