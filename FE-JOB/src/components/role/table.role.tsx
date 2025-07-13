
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import queryString from 'query-string';

import { sfLike } from "spring-filter-query-builder";
import { groupByPermission } from "@/services/utils";
import { callDeleteRole, callFetchPermission, callFetchRole } from "@/services/api";
import ModalRole from "./modal.role";
import Access from "@/share/Access";
import { ALL_PERMISSIONS } from "@/services/permissions";

const TableRole = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const tableRef = useRef<ActionType | undefined>(undefined);

    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 8,
        pages: 0,
        total: 0
    });


    //all backend permissions
    const [listPermissions, setListPermissions] = useState<{
        module: string;
        permissions: IPermission[]
    }[] | null>(null);

    //current role
    const [singleRole, setSingleRole] = useState<IRole | null>(null);

    useEffect(() => {
        const init = async () => {
            const res = await callFetchPermission(`page=1&size=100`);
            if (res.data?.result) {
                setListPermissions(groupByPermission(res.data?.result))
            }
        }
        init();
    }, [])


    const handleDeleteRole = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteRole(id);
            if (res && res.statusCode === 200) {
                message.success('Xóa Role thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IRole>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <span>
                        {record.id}
                    </span>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render(dom, entity, index, action, schema) {
                return <>
                    <Tag color={entity.active ? "lime" : "red"} >
                        {entity.active ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                </>
            },
            hideInSearch: true,
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
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
            render: (text, record, index, action) => {
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
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.ROLES.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setSingleRole(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.ROLES.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa role"}
                            description={"Bạn có chắc chắn muốn xóa role này ?"}
                            onConfirm={() => handleDeleteRole(entity.id)}
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
                    </Access>
                </Space>
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }

        if (clone.name) q.filter = `${sfLike("name", clone.name)}`;

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
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

    return (
        <div>

            <Access
                permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}
            >
                <ProTable<IRole>
                    actionRef={tableRef}
                    headerTitle="Danh sách Roles (Vai Trò)"
                    rowKey="id"
                    columns={columns}
                    request={async (params, sort, filter) => {
                        // await waitTime(500);
                        const query = buildQuery(params, sort, filter);
                        const res = await callFetchRole(query);
                        const data = res?.data;
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
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Access
                                permission={ALL_PERMISSIONS.ROLES.CREATE}
                                hideChildren
                            >
                                <Button
                                    icon={<PlusOutlined />}
                                    type="primary"
                                    onClick={() => setOpenModal(true)}
                                >
                                    Thêm mới
                                </Button>
                            </Access>
                        );
                    }}
                />
            </Access>
            <ModalRole
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                listPermissions={listPermissions!}
                singleRole={singleRole}
                setSingleRole={setSingleRole}
            />
        </div>
    )
}

export default TableRole;