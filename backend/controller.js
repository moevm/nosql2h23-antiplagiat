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
            const branches = repo.branches;
            repo.branches = branches.map( branch => branch.name );
            delete repo.link;
        }
        return repos;
    }


    async ExtractFiles( commits, { dateFrom = 0, dateTo = 0, docTypes = [], sortBy = "", sortOrder = "asc" } )
    {
        const files = [];
        for ( const hash of commits )
        {
            const commit = await Db.commitCollection.FindOne( hash );
            if ( 0 != dateFrom && commit.date < dateFrom )
            {
                continue
            }
            if ( 0 != dateTo && commit.date > dateTo )
            {
                continue
            }
            if ( !commit )
            {
                continue;
            }
            for ( const fileId of commit.files )
            {
                const file  = await Db.fileCollection.FindById( fileId );
                if ( !file )
                {
                    continue;
                }
                const parts = file.name.split( "." );
                const ext   = parts[ parts.length - 1 ];
                if ( 0 != docTypes.length && !docTypes.includes( ext ) )
                {
                    continue;
                }
                if ( !files.find( f => f.name == file.name ) )
                {
                    files.push( {
                        "fileId": file._id,
                        "fileName": file.name,
                        "checkStatus": ( 0 != file.checks.length ),
                        "matchPercent": ( 0 != file.checks.length 
                                        ? file.checks[ file.checks.length - 1 ].result : 0.0 )
                    } );
                }
            }
        }
        if ( [ "fileName", "checkStatus", "matchPercent" ].includes( sortBy ) )
        {
            const isReverse = sortOrder == 'desc' ? -1 : 1;
            files.sort( ( a, b ) => {
                if ( a[ sortBy ] > b[ sortBy ] )
                {
                    return isReverse * -1;
                }
                else if ( a[ sortBy ] < b[ sortBy ] )
                {
                    return isReverse * 1;
                }
                return 0;
            } );
        }
        return files;
    }


    async GetBranchInfo( repoId, branchName, { dateFrom = 0, dateTo = 0, docTypes = [], sortBy = "", sortOrder = "asc" } )
    {
        const repo = await Db.repoCollection.FindById( repoId );
        if ( !repo )
        {
            return [];
        }

        const branch = repo.branches.find( br => br.name == branchName );
        if ( !branch )
        {
            return [];
        }

        const files = await this.ExtractFiles( branch.commits.reverse()
            , { dateFrom, dateTo, docTypes, sortBy, sortOrder } );
        const info = {
            "repoId": repoId,
            "repoName": repo.name,
            "branchName": branchName,
            "files": files
        };

        return info;
    }


    async GetStatistics( { repoIds = [], docTypes = [], dateFrom = 0, dateTo = 0, statisticsType = "" } )
    {
        const statistics = [];
        let repos = await Db.repoCollection.FindAll();
        if ( !repos.length )
        {
            return [];
        }
        if ( repoIds && 0 != repoIds.length )
        {
            repos = repos.filter( repo => repoIds.includes( repo._id ) );
        }

        for ( const repo of repos )
        {
            for ( const branch of repo.branches )
            {
                const branchInfo = await this.GetBranchInfo( repo._id, branch.name
                    , { docTypes, dateFrom, dateTo } );
                statistics.push( branchInfo );
            }
        }

        return statistics;
    }


    async GetChecks( fileId )
    {
        const file = await Db.fileCollection.FindById( fileId );
        if ( !file )
        {
            return {};
        }
        const commit = await Db.commitCollection.FindOne( file.commit );
        const info = {
            "fileName": file.name,
            "pushDate": commit?.date,
            "commit": file.commit,
            "author": commit?.author,
            "checks": []
        };

        for ( const checkInfo of file.checks )
        {
            const check = await Db.checkCollection.FindOne( checkInfo._id );
            if ( !check )
            {
                continue;
            }
            const pairs = check.pairs?.filter( p => {
                return p.file1 == fileId || p.file2 == fileId;
            } ) || [];
            const matches = [];
            for ( const pair of pairs )
            {
                const otherId = ( pair.file1 == fileId ? pair.file2 : pair.file1 );
                const other = await Db.fileCollection.FindById( otherId );
                if ( !other )
                {
                    continue;
                }
                const othCommit = await Db.commitCollection.FindOne( other.commit );
                const match = {
                    "fileName": other.name,
                    "matchPercent": pair.result,
                    "pushDate": othCommit?.date,
                    "author": othCommit?.author,
                    "matchedLines": []
                };
                for ( const m of pair.matches )
                {
                    if ( fileId == pair.file1 )
                    {
                        match[ "matchedLines" ].push( {
                            "initial": file.text.substring( m.matchIndex1, m.matchIndex1 + m.matchLength ),
                            "outer": other.text.substring( m.matchIndex2, m.matchIndex2 + m.matchLength )
                        } );
                    }
                    else
                    {
                        match[ "matchedLines" ].push( {
                            "initial": other.text.substring( m.matchIndex1, m.matchIndex1 + m.matchLength ),
                            "outer": file.text.substring( m.matchIndex2, m.matchIndex2 + m.matchLength )
                        } );
                    }
                }
                matches.push( match );
            }
            info[ "checks" ].push( {
                "id": checkInfo._id,
                "date": check.date,
                "matches": matches
            } );
        }
        return info;
    }

    async GetAllData()
    {
        return {
            "repo": await Db.repoCollection.FindAll(),
            "commit": await Db.commitCollection.FindAll(),
            "file": await Db.fileCollection.FindAll(),
            "check": await Db.checkCollection.FindAll()
        };
    }

    async PutAllData( data )
    {
        Db.repoCollection.NormalizeIds( data[ "repo" ] );
        Db.repoCollection.NormalizeIds( data[ "file" ] );
        Db.repoCollection.NormalizeIds( data[ "check" ] );

        await Db.repoCollection.InsertMany( data[ "repo" ] );
        await Db.commitCollection.InsertMany( data[ "commit" ] );
        await Db.fileCollection.InsertMany( data[ "file" ] );
        await Db.checkCollection.InsertMany( data[ "check" ] );

        for ( const repo of data[ "repo" ] )
        {
            GitFetch.CloneRepo( repo.link ).catch( e => console.error( e ) );
        }
    }

};


export { Controller };
