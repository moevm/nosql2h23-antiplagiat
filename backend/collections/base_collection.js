class BaseCollection
{
    constructor( db, collectionName )
    {
        this.collection = db.collection( collectionName );
    }


    async FindAll()
    {
        const records = await this.collection.find( {} ).toArray();
        return records;
    }


    async InsertOne( record )
    {
        const identifier = await this.collection.insertOne( record );
        return identifier;
    }


    async InsertMany( records )
    {
        try
        {
            const insertResult = await this.collection.insertMany( records, { ordered: true } );
            return { ids: insertResult.insertedIds, insertResult };
        }
        catch ( e )
        {
            return { ids: [], insertResult: e.result };
        }
    }
};

export { BaseCollection };
