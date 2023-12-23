import axios from "axios";

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
    return data.data
}

export const checkFilesInRepo = async (repoId: string, settings: any) => {
    return await axios.post(`/backend/repo/${repoId}/check`, settings)
}

