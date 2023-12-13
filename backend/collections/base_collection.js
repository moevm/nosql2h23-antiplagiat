class BaseCollection
{
    constructor( db, collectionName )
    {
        this.collection = db.collection( collectionName );
    }


    async FindAll()
    {
        return await this.collection.find().toArray();
    }


    async InsertOne( record )
    {
        return await this.collection.insertOne( record );
    }


    async InsertMany( records )
    {
        try
        {
            const insertResult = await this.collection.insertMany( records, { ordered: false } );
            return { ids: insertResult.insertedIds, insertResult };
        }
        catch ( e )
        {
            return { ids: [], insertResult: e.result };
        }
    }
};

export { BaseCollection };
