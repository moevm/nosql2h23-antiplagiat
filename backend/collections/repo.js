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
        return await this.collection.findOne( { "_id": new ObjectId( id ) } );
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
