import axios from "axios";

export const fetchReposStatistics = async () => {
    const data = await axios
        .get('/backend/repos/statistics',
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