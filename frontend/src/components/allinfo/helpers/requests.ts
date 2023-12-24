import axios from "axios";

export const adaptStatsForClient = (stats: any) => {
    return stats.flatMap((s: any) => {
        return s.files.map((f: any) => ({...f, repoName: s.repoName, branchName: s.branchName}))
    })
}

export const fetchAllInfo = async () => {
    const data = await axios
        .get('/backend/repo/statistics')
    return adaptStatsForClient( data.data )
}