import * as Db from "./db.js";
import * as GitFetch from "./git_fetch.js";

class Controller
{

    async GetAllRepos()
    {
        return await Db.repoCollection.FindAll();
    }


    async GetAllCommits()
    {
        return await Db.commitCollection.FindAll();
    }


    async GetAllFiles()
    {
        return await Db.fileCollection.FindAll();
    }


    async GetAllChecks()
    {
        return await Db.checkCollection.FindAll();
    }


    AddRepo( url )
    {
        return GitFetch.FetchRepoByUrl( url, Db.repoCollection,
            Db.commitCollection, Db.fileCollection );
    }


    UpdateRepo( name )
    {
        return GitFetch.FetchRepoByName( name, Db.repoCollection,
            Db.commitCollection, Db.fileCollection );
    }


    async GetAllReposBranches()
    {
        const repos = await this.GetAllRepos();
        for ( const repo of repos )
        {
            delete repo.link;
            for ( const branch of repo.branches )
            {
                delete branch.commits;
            }
        }
        return repos;
    }


    async GetBranchFiles( repoName, branchName )
    {
        const repo = await Db.repoCollection.FindOne( repoName );
        if ( !repo )
        {
            return [];
        }

        const branch = repo.branches.find( br => br.name == branchName );
        if ( !branch )
        {
            return [];
        }

        const files = [];
        branch.commits.reverse();
        for ( const commitHash of branch.commits )
        {
            const commit = await Db.commitCollection.FindByHash( commitHash );
            for ( const fileId of commit.files )
            {
                const file = await Db.fileCollection.FindById( fileId );
                if ( file && !files.find( f => f.name == file.name ) )
                {
                    files.push( file );
                }
            }
        }

        return files;
    }

};

export { Controller };
