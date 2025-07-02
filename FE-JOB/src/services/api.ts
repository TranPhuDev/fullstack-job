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


export const fetchAccountAPI = () => {
    const urlBackEnd = "/api/v1/auth/account"
    return axios.get<IBackendRes<IGetAccount>>(urlBackEnd, {
        headers: {
            delay: 1000
        }
    })
}


export const logoutAPI = () => {
    const urlBackEnd = "/api/v1/auth/logout"
    return axios.post<IBackendRes<IAccount>>(urlBackEnd)
}


/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

//Module User
export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}

export const callGetUserById = (id: string | number) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callCreateUser = (values: { [key: string]: any }) => {
    const urlBackEnd = "/api/v1/users"
    return axios.post<IBackendRes<IUser>>(urlBackEnd, values)
}

export const callUpdateUser = (values: { [key: string]: any }) => {
    const urlBackEnd = "/api/v1/users"
    return axios.put<IBackendRes<IUser>>(urlBackEnd, values)
}

export const callDeleteUser = (id: string) => {
    return axios.delete(`/api/v1/users/${id}`);
}

//Module Company 
export const callFetchCompany = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICompany>>>(`/api/v1/companies?${query}`);
}


//Module Role
export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callDeleteSingleFile = (fileName: string, folder: string) => {
    return axios.delete(`/api/v1/files`, {
        params: { fileName, folder }
    });
};
