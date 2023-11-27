import { readdir } from "node:fs/promises";
import { join } from "node:path";
import NodeGit from "nodegit";


function ProcessGitError( errorReason )
{
    console.error( "Git error:", errorReason );
}


async function FetchRepo( repo )
{
    await repo.fetch( "origin" );
    console.info( "Repo " + repo.path() + " has been fetched" );
    return repo;
}


async function GetBranches( repo )
{
    const refNames = await repo.getReferenceNames( NodeGit.Reference.TYPE.ALL );
    const branches = refNames.filter( ( name ) =>
        name.startsWith( "refs/heads/" )
        || name.startsWith( "refs/remotes/" )
    );
    return { repo, branches };
}


async function GetRepoFiles( name )
{
    const repoPath = process.env.ANTIPLAGIAT_REPOS_DIR + "/" + name + "/";
    const walk = async ( dirPath ) => Promise.all(
        await readdir( dirPath, { withFileTypes: true } )
        .then( ( entries ) => entries.map( ( entry ) =>
        {
            const childPath = join( dirPath, entry.name );
            if ( entry.isDirectory() && entry.name == ".git" )
            {
                return [];
            }
            return entry.isDirectory() ? walk( childPath ) : childPath.substring( repoPath.length );
        } ) )
    );
    const filesTree = await walk( repoPath );
    return filesTree.flat( Number.POSITIVE_INFINITY );
}


async function GetFileLatestCommit( repo, commitHash, filename )
{
    const blockSize = 100;
    const revWalk = await repo.createRevWalk();
    revWalk.push( commitHash );
    revWalk.sorting( NodeGit.Revwalk.SORT.TIME );

    const findCommits = async ( walker ) =>
    {
        const historyEntries = await walker.fileHistoryWalk( filename, blockSize );
        if ( historyEntries.length == 0 )
        {
            if ( historyEntries.reachedEndOfHistory )
            {
                throw new Error( "No commits found for file " + filename );
            }
            return await findCommits( walker );
        }
        return historyEntries[ 0 ].commit;
    };

    return await findCommits( revWalk );
}


async function FillRepoInfo( name, repo, branches,
    repoCollection, commitCollection, fileCollection )
{
    for ( const branch of branches )
    {
        await repo.checkoutBranch( branch );
        const headCommit = await repo.getHeadCommit();
        const filenames = await GetRepoFiles( name );
        for ( const filename of filenames )
        {
            const commit = await GetFileLatestCommit( repo, headCommit.sha(), filename );
            console.log( "file:", filename );

            // todo: считывание файлов с ветки, заполнение базы
            // timeMs() returns unix timestamp * 1000
            console.log("branch:", branch, "\ncommit:", commit.sha(),
                "\nauthor:", commit.author().name(), "\ntime:", commit.timeMs());
        }
    }
}


function ProcessRepo( name, repoPromise, repoCollection, commitCollection, fileCollection )
{
    let result = true;
    repoPromise.then( FetchRepo )
        .then( GetBranches )
        .then( async ( args ) => {
            await FillRepoInfo( name, args.repo, args.branches,
                repoCollection, commitCollection, fileCollection );
        } )
        .catch( ( errorReason ) =>
        {
            result = false;
            ProcessGitError( errorReason );
        } );
    return result;
}


/**
 * @brief Клонирует репозиторий в папку проекта, заносит данные в коллекции БД.
 * @param {string} url ссылка на репозиторий.
 * @param {RepoCollection} repoCollection коллекция репозиториев.
 * @param {CommitCollection} commitCollection коллекция коммитов.
 * @param {FileCollection} fileCollection коллекция файлов.
 * @return {boolean} true при успехе, false при неудаче.
 */
function FetchRepoByUrl( url, repoCollection, commitCollection, fileCollection )
{
    const name = url.substring( url.lastIndexOf( "/" ) + 1, url.lastIndexOf( ".git" ) );
    const repoPromise = NodeGit.Clone( url, process.env.ANTIPLAGIAT_REPOS_DIR + "/" + name );
    return ProcessRepo( name, repoPromise, repoCollection, commitCollection, fileCollection );
}


/**
 * @brief Обновляет склонированный репозиторий, заносит данные в коллекции БД.
 * @param {string} name имя репозитория.
 * @param {RepoCollection} repoCollection коллекция репозиториев.
 * @param {CommitCollection} commitCollection коллекция коммитов.
 * @param {FileCollection} fileCollection коллекция файлов.
 * @return {boolean} true при успехе, false при неудаче.
 */
function FetchRepoByName( name, repoCollection, commitCollection, fileCollection )
{
    const repoPromise = NodeGit.Repository.open( process.env.ANTIPLAGIAT_REPOS_DIR + "/" + name + "/.git" );
    return ProcessRepo( name, repoPromise, repoCollection, commitCollection, fileCollection );
}


export { FetchRepoByUrl, FetchRepoByName };
