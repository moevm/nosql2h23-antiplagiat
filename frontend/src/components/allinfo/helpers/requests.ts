import axios from "axios";

export const adaptStatsForClient = (stats: any) => {
    return stats.flatMap((s: any) => {
        return s.files.map((f: any) => ({...f, repoName: s.repoName, branchName: s.branchName}))
    })
}

export const fetchAllInfo = async ( docTypes: any[] = [], dateFrom = 0, dateTo = 0 ) => {
    const statParams: { [k: string]: any} = {}
    if (docTypes.length) {
        statParams.docTypes = docTypes.join( ',' )
    }
    if (dateFrom) {
        statParams.dateFrom = dateFrom
    }
    if (dateTo) {
        statParams.dateTo = dateTo
    }
    const data = await axios.get('/backend/repo/statistics', { params: statParams })
    return adaptStatsForClient( data.data )
}