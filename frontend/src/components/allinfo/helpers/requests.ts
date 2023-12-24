import axios from "axios";

export const adaptStatsForClient = (stats: any) => {
    return stats.flatMap((s: any) => {
        return s.files.map((f: any) => ({...f, repoName: s.repoName, branchName: s.branchName}))
    })
}

export const fetchAllInfo = async ( docTypes: any[] = [], dateFrom = 0, dateTo = 0 ) => {
    const docTypesStr = docTypes.join( ',' )
    const url = `/backend/repo/statistics?docTypes=${docTypesStr}&dateFrom=${dateFrom}&dateTo=${dateTo}`
    const data = await axios.get( url )
    return adaptStatsForClient( data.data )
}