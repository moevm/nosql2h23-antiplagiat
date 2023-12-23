import axios from "axios";

export const fetchRepoByName = async (repoId: string, branchName: string, sortBy?: string, sortOrder = 'asc') => {
    if (!repoId) return
    const queryparams: { [k: string]: string } = {
        repoId,
        branchName
    }
    if (sortBy) {
        queryparams['sortBy'] = sortBy
        queryparams['sortOrder'] = sortOrder
    }
    const data = await axios
        .get(`/backend/repo/branch`,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization',
                    'Content-Type': 'application/json'
                },
                params: queryparams
            })
    return data.data
}

export const checkFilesInRepo = async (repoId: string, settings: any) => {
    return await axios.post(`/backend/repo/${repoId}/check`, settings)
}

export const getFileCheckInfo = async (fileId: string) => {
    return await axios.get(`/backend/repo/file/${fileId}`)
}

