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
        return await this.collection.findOne( { name } );
    }


    async FindById( id )
    {
        return await this.collection.findOne( { "_id": new ObjectId( String( id ) ) } );
    }


    /**
    * @detail
    * Пример docTypes: [ "txt", "cpp", "h" ]
    * Пример filter:
    * {
    *  "repos": [
    *    {
    *       "id": "65832a5be26fa156185ce3bd",
    *       "branches": [ "b1", "b2" ]
    *    } ]
    * }
    */
    async FindFilesByPattern( docTypes, filter )
    {
        let branchFilters = [];
        for ( const repo of filter.repos )
        {
            branchFilters.push( {
                "_id": new ObjectId( repo.id ),
                "branches.name": { "$in": repo.branches }
            } );
        }
        const extenstionRegexp = docTypes.length > 0 ? ( "^.*\\.(" + docTypes.join( "|" ) + ")$" ) : "^.*$";
        return await this.collection.aggregate( [
            { "$unwind": "$branches" },
            { "$match": {
                    "$or": branchFilters
                }
            },
            {
                "$lookup": {
                    "from": "commit",
                    "localField": "branches.commits",
                    "foreignField": "_id",
                    "as": "commitInfo"
                }
            },
            { "$unwind": "$commitInfo" },
            {
                "$lookup": {
                    "from": "file",
                    "localField": "commitInfo._id",
                    "foreignField": "commit",
                    "as": "file"
                }
            },
            { "$unwind": "$file" },
            {
                "$project": {
                    "repoId": "$_id",
                    "_id": "$file._id",
                    "name": "$file.name",
                    "data": "$file.data"
                }
            },
            { "$match": {
                    "name": { "$regex": extenstionRegexp, "$options": "mi" }
                }
            }
        ] ).toArray();
    }


    async UpdateOne( repo )
    {
        const oldRepo = await this.FindOne( repo.name );
        if ( !oldRepo )
        {
            // нет такого репозитория - добавить в базу
            return await this.collection.insertOne( repo );
        }
        oldRepo.link = repo.link;
        this.#MergeRepoInfo( oldRepo, repo );
        return await this.collection.updateOne( { name: repo.name }, { $set: oldRepo } );
    }


    #MergeRepoInfo( oldRepo, repo )
    {
        for ( const branch of repo.branches )
        {
            const oldBranch = oldRepo.branches.find( b => b.name == branch.name );
            if ( !oldBranch )
            {
                oldRepo.branches.push( branch );
                continue;
            }
            for ( const commit of branch.commits )
            {
                if ( !oldBranch.commits.find( c => c == commit ) )
                {
                    oldBranch.commits.push( commit );
                }
            }
        }
    }
};

export { RepoCollection };
