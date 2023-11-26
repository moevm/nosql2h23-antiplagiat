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
    return { "repo": repo, "branches": branches };
}


async function FillRepoInfo( name, repo, branches,
    repoCollection, commitCollection, fileCollection )
{
    for ( const branch of branches )
    {
        await repo.checkoutBranch( branch );
        const commit = await repo.getHeadCommit();

        // todo: считывание файлов с ветки, заполнение базы
        // timeMs() returns unix timestamp
        console.log("branch:", branch, "\ncommit:", commit.sha(),
            "\nauthor:", commit.author().name(), "\ntime:", commit.timeMs());
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
