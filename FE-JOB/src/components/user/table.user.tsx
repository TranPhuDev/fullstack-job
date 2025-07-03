import { callFetchUser, callDeleteUser } from '@/services/api';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useRef, useState } from 'react';
import { sfLike } from 'spring-filter-query-builder';
import CreateUser from './create.user';
import UpdateUser from './update.user';
import defaultAvatar from 'assets/images/default-avatar.jpg'
import { App } from 'antd';
import DetailUser from './detail.user';

export const waitTimePromise = async (time: number = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
export const waitTime = async (time: number = 1000) => {
    await waitTimePromise(time);
};
export default function TableUser() {
    const { message } = App.useApp();

    const columns: ProColumns<IUser>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.page - 1) * (meta.pageSize)}
                    </>)
            },
            hideInSearch: true,
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            width: 70,
            render: (avatar, record) => {
                const isValidAvatar = avatar && avatar !== '-' && avatar !== 'null';
                return (
                    <img
                        src={isValidAvatar ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${avatar}` : defaultAvatar}
                        alt={record.name}
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#f0f0f0' }}
                        onError={e => { e.currentTarget.src = defaultAvatar; }}
                    />
                );
            },
            hideInSearch: true,
        },
        {
            title: 'Name',
            dataIndex: 'name'
        }
        ,
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Role',
            dataIndex: ["role", "name"],
            hideInSearch: true

        },
        {
            title: 'Company',
            dataIndex: ["company", "name"],
            hideInSearch: true

        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (_text, record) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (_text, record) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity) => (
                <Space>
                    <EyeOutlined
                        style={{ fontSize: 20, marginRight: 10, color: '#1677ff', cursor: 'pointer' }}
                        onClick={() => {
                            setDataDetail(entity);
                            setOpenModalDetail(true);
                        }}
                    />
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            color: '#ffa500',
                        }}

                        onClick={() => {
                            setOpenModalUpdate(true);
                            setDataUpdate(entity);
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa user"}
                        description={"Bạn có chắc chắn muốn xóa user này ?"}
                        onConfirm={() => entity.id && handleDeleteUser(entity.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <DeleteOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#ff4d4f',
                                }}
                            />
                        </span>
                    </Popconfirm>
                </Space >
            ),
        }
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }

        const clone = { ...params };
        if (clone.name) q.filter = `${sfLike("name", clone.name)}`;
        if (clone.email) {
            q.filter = clone.name ?
                q.filter + " and " + `${sfLike("email", clone.email)}`
                : `${sfLike("email", clone.email)}`;
        }

        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.email) {
            sortBy = sort.email === 'ascend' ? "sort=email,asc" : "sort=email,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

    //modal create user
    const [openModal, setOpenModal] = useState<boolean>(false);

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    //modal update user
    const [openModalUpdate, setOpenModalUpdate,] = useState<boolean>(false)
    const [dataUpdate, setDataUpdate] = useState<IUser | null>(null)

    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState<IUser | null>(null);

    const actionRef = useRef<ActionType | undefined>(undefined);
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 8,
        pages: 0,
        total: 0
    });

    const handleDeleteUser = async (id: string) => {
        const res = await callDeleteUser(id);
        if (res && res.data) {
            message.success('Xóa user thành công');
            refreshTable();
        } else {
            message.error('Xóa user thất bại');
        }
    };

    return (
        <div>
            <ProTable<IUser>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    await waitTime(500);
                    const query = buildQuery(params, sort, filter);
                    const res = await callFetchUser(query);
                    const data = res?.data as IModelPaginate<IUser>;
                    if (data) {
                        setMeta(data.meta)
                    }
                    return {
                        data: data?.result || [],
                        page: 1,
                        success: true,
                        total: meta.total || 0,
                    };
                }}
                scroll={{ x: true }}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => { return (<div>{range[0]} - {range[1]} trên {total} rows</div>) }
                }}
                dateFormatter="string"
                headerTitle="Table User"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModal(true);
                        }}
                        type="primary"
                    >
                        Thêm mới
                    </Button>
                ]}
            />
            <CreateUser openModal={openModal} setOpenModal={setOpenModal} refreshTable={refreshTable} />
            <UpdateUser openModalUpdate={openModalUpdate} setOpenModalUpdate={setOpenModalUpdate} refreshTable={refreshTable} setDataUpdate={setDataUpdate} dataUpdate={dataUpdate} />
            <DetailUser open={openModalDetail} onClose={() => setOpenModalDetail(false)} user={dataDetail} />
        </div>
    );
};
