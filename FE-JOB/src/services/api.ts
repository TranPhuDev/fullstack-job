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

export const callCreateCompany = (values: { [key: string]: any }) => {
    return axios.post<IBackendRes<ICompany>>('/api/v1/companies', values)
}

export const callUpdateCompany = (id: string, name: string, address: string, workingTime: string, field: string, scale: string, overTime: string, description: string, logo: string) => {
    return axios.put<IBackendRes<ICompany>>(`/api/v1/companies`, { id, name, address, workingTime, field, scale, overTime, description, logo })
}

export const callDeleteCompany = (id: string) => {
    return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}

export const callFetchCompanyById = (id: string) => {
    return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}


export const callFetchCompanyWithJobs = () => {
    return axios.get<IBackendRes<ICompanyWithJobs[]>>(`/api/v1/companies-with-jobs`);
}

//Module skill
export const callCreateSkill = (data: { name: string }) => {
    return axios.post<IBackendRes<ISkill>>('/api/v1/skills', { ...data })

}


export const callUpdateSkill = (data: { name: string }, id: string) => {
    return axios.put<IBackendRes<ISkill>>(`/api/v1/skills`, { ...data, id })
}

export const callDeleteSkill = (id: string) => {
    return axios.delete<IBackendRes<ISkill>>(`/api/v1/skills/${id}`);
}

export const callFetchAllSkill = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISkill>>>(`/api/v1/skills?${query}`);
}

//Module Job
export const callCreateJob = (job: IJob) => {
    return axios.post<IBackendRes<IJob>>('/api/v1/jobs', { ...job })
}

export const callUpdateJob = (job: IJob, id: string) => {
    return axios.put<IBackendRes<IJob>>(`/api/v1/jobs`, { id, ...job })
}

export const callDeleteJob = (id: string) => {
    return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

export const callFetchJob = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`);
}

export const callFetchJobById = (id: string) => {
    return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
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
