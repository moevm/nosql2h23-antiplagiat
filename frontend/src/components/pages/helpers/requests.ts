import axios from "axios";

const adaptReposFromServer = (data: any) => {
    return data.map((i: any) => ({
        _id: i._id,
        name: i.name,
        branches: i.branches
    }))
}

export const fetchReposAll = async () => {
    const data = await axios
        .get(`http://localhost:8088/repo/all`,
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

export const addRepo = (url: string) => {
    return axios.post(`http://localhost:8088/repo/add`, null, {params: {url}})
}
