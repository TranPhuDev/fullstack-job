export { };

declare global {

    export interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    export interface IModelPaginate<T> {
        meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    export interface IAccount {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            age: number;
            gender: string;
            address: string;
            role: {
                id: string;
                name: string;
                permissions: {
                    id: string;
                    name: string;
                    apiPath: string;
                    method: string;
                    module: string;
                }[]
            }
        }
    }

    export interface IGetAccount extends Omit<IAccount, "access_token"> { }

    export interface ICompany {
        id?: string;
        name?: string;
        address?: string;
        workingTime?: string;
        field?: string;
        scale?: string;
        overTime?: string;
        logo: string;
        companyPic?: string;
        description?: string;
        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;
    }

    export interface ISkill {
        id?: string;
        name?: string;
        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;
    }



    export interface IUser {
        id?: string;
        name: string;
        email: string;
        password?: string;
        age?: number;
        gender?: string;
        address?: string;
        avatar?: string;
        role?: {
            id: string;
            name: string;
            permissions: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }

        company?: {
            id: string;
            name: string;
        }
        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;
    }

    export interface IJob {
        id?: string;
        name: string;
        skills: ISkill[];
        company?: {
            id: string;
            name: string;
            address: string;
            logo?: string;
        }
        location: string;
        salary: number;
        quantity: number;
        level: string;
        workplace: string;
        expertise: string;
        description: string;
        startDate: Date;
        endDate: Date;
        active: boolean;

        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;
    }

    export interface ICompanyWithJobs {
        id: string;
        name: string;
        logo: string;
        address: string;
        description: string;
        workingTime: string;
        companyPic?: string;
        field: string;
        scale: string;
        overTime: string;
        jobCount: number;
        jobNames: string[];
        jobIds: number[];
    }

    export interface IResume {
        id?: string;
        email: string;
        userId: string;
        url: string;
        status: string;
        companyId: string | {
            id: string;
            name: string;
            logo: string;
        };
        jobId: string | {
            id: string;
            name: string;
        };
        history?: {
            status: string;
            updatedAt: Date;
            updatedBy: { id: string; email: string }
        }[]
        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;
    }

    export interface IPermission {
        id?: string;
        name?: string;
        apiPath?: string;
        method?: string;
        module?: string;

        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;

    }

    export interface IRole {
        id?: string;
        name: string;
        description: string;
        active: boolean;
        permissions: IPermission[] | string[];

        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;
    }

    export interface ISubscribers {
        id?: string;
        name?: string;
        email?: string;
        skills: { id: string }[];
        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;
        receiveEmail?: boolean;
    }
}