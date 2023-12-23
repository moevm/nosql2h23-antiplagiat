import axios from "axios";

export const fetchReposStatistics = async () => {
    const data = await axios
        .get('/backend/repo/allInfo')
    return data.data
}