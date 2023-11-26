import * as Db from "./db.js";

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

};

export { Controller };
