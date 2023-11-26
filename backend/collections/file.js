import { ObjectId } from "mongodb";

class FileCollection
{
    constructor( db )
    {
        this.collection = db.collection( "file" );
    }

    async FindAll()
    {
        const records = await this.collection.find( {} ).toArray();
        return records;
    }
};

export { FileCollection };
