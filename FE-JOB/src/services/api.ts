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

// Đổi mật khẩu user
export const callChangePassword = (currentPassword: string, newPassword: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users/change-password', {
        currentPassword,
        newPassword,
    });
}

//Module Company 
export const callFetchCompany = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICompany>>>(`/api/v1/companies?${query}`);
}

export const callCreateCompany = (values: { [key: string]: any }) => {
    return axios.post<IBackendRes<ICompany>>('/api/v1/companies', values)
}

export const callUpdateCompany = (id: string, name: string, address: string, workingTime: string, field: string, scale: string, overTime: string, description: string, logo: string, companyPic: string) => {
    return axios.put<IBackendRes<ICompany>>(`/api/v1/companies`, { id, name, address, workingTime, field, scale, overTime, description, logo, companyPic })
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

// Fetch all skills without pagination for job management
export const callFetchAllSkillsForJob = () => {
    return axios.get<IBackendRes<ISkill[]>>(`/api/v1/skills/all`);
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



//Module Resume
export const callCreateResume = (url: string, jobId: any, email: string, userId: string | number) => {
    return axios.post<IBackendRes<IResume>>('/api/v1/resumes', {
        email, url,
        status: "PENDING",
        user: {
            "id": userId
        },
        job: {
            "id": jobId
        }
    })
}

export const callUpdateResumeStatus = (id: any, status: string) => {
    return axios.put<IBackendRes<IResume>>(`/api/v1/resumes`, { id, status })
}

export const callDeleteResume = (id: string) => {
    return axios.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResume = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes?${query}`);
}

export const callFetchResumeById = (id: string) => {
    return axios.get<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResumeByUser = () => {
    return axios.post<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes/by-user`);
}

//Module Permission
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.put<IBackendRes<IPermission>>(`/api/v1/permissions`, { id, ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}



//Module Role
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles`, { id, ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}


export const callDeleteSingleFile = (fileName: string, folder: string) => {
    return axios.delete(`/api/v1/files`, {
        params: { fileName, folder }
    });
};


//Module subscriber
export const callCreateSubscriber = (subs: ISubscribers) => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers', { ...subs })
}

export const callGetSubscriberSkills = () => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers/skills')
}

export const callUpdateSubscriber = (subs: ISubscribers) => {
    return axios.put<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, { ...subs })
}

export const callDeleteSubscriber = (id: string) => {
    return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

export const callFetchSubscriber = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(`/api/v1/subscribers?${query}`);
}

export const callFetchSubscriberById = (id: string) => {
    return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

// Hủy đăng ký nhận mail
export const callUnsubscribeSubscriber = (email: string) => {
    return axios.put(`/api/v1/subscribers/unsubscribe?email=${email}`);
}

// Đăng ký lại nhận mail
export const callResubscribeSubscriber = () => {
    return axios.put('/api/v1/subscribers/resubscribe');
}

// Gửi mail cho user hiện tại
export const callSendMailToCurrentUser = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/email');
}
