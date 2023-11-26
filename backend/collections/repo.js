import { ObjectId } from "mongodb";

class RepoCollection
{
    constructor( db )
    {
        this.collection = db.collection( "repo" );
    }

    async FindAll()
    {
        const records = await this.collection.find( {} ).toArray();
        return records;
    }
};

export { RepoCollection }