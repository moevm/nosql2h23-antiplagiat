import { ObjectId } from "mongodb";

class CommitCollection
{
    constructor( db )
    {
        this.collection = db.collection( "commit" );
    }

    async FindAll()
    {
        const records = await this.collection.find( {} ).toArray();
        return records;
    }
};

export { CommitCollection }