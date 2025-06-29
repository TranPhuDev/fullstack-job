
import axios from 'services/axios.customize'

export const loginAPI = (values: { [key: string]: any }) => {
    const urlBackEnd = "/api/v1/auth/login"
    return axios.post<IBackendRes<IAccount>>(urlBackEnd, values, {
        headers: {
            delay: 1000
        }
    })
}


export const registerAPI = (values: { [key: string]: any }) => {
    const urlBackEnd = "/api/v1/auth/register"
    return axios.post<IBackendRes<IUser>>(urlBackEnd, values)
}

