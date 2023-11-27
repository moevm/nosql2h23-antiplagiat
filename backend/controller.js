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

};

export { Controller };
