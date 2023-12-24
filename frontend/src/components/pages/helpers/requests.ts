import axios from "axios";
import { saveAs } from "file-saver";

const adaptReposFromServer = (data: any) => {
    return data.map((i: any) => ({
        _id: i._id,
        name: i.name,
        branches: i.branches
    }))
}

export const fetchReposAll = async () => {
    const data = await axios
        .get('/backend/repo/list',
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

export const addRepo = (myUrl: string) => {
    return axios.post('/backend/repo/add', {myUrl})
}

export const downloadData = ( file: any ) => {
    const formData = new FormData();
    formData.append( 'data', file );
    return axios
        .post( '/backend/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    return axios.get('/backend/import')
}

export const exportData = () => {
    return axios
        .get( '/backend/export', { responseType: 'blob' } )
        .then( response => {
            saveAs( response.data , 'export.json' );
        } )
}
