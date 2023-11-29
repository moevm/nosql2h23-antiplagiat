import axios from "axios";

const adaptReposFromServer = (data: any) => {
    return data.map((i: any) => ({
        _id: i._id,
        name: i.name,
        text: i.text,
        commit: i.commit,
        data: i.data,
        checks: i.checks
    }))
}

export const fetchRepoByName = async (repo: string, branch: string) => {
    const data = await axios
        .get(`http://localhost:8088/repo/files?repoName=${repo}&branchName=${branch}`,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization',
                    'Content-Type': 'application/json'
                }
            })
    return adaptReposFromServer(data.data)
}
