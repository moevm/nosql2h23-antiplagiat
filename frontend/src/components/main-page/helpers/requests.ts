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
    if (!repo) return
    const data = await axios
        .get(`/backend/repo/branch?repoId=${repo}&branchName=${branch}`,
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
