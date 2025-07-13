import { callDeletePermission, callFetchPermission } from "@/services/api";
import { colorMethod } from "@/services/utils";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Space } from "antd";
import dayjs from "dayjs";
import queryString from "query-string";
import { useRef, useState } from "react";
import CreatePermission from "./create.permission";
import UpdatePermission from "./update.permission";
import DetailPermission from "./detail.permission";
import Access from "@/share/access";
import { ALL_PERMISSIONS } from "@/services/permissions";
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
const TablePermission = () => {
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IPermission | null>(null);
    const { message, notification } = App.useApp();
    const tableRef = useRef<ActionType | undefined>(undefined);
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 8,
        pages: 0,
        total: 0
    });

    const handleDeletePermission = async (id: string | undefined) => {
        if (id) {
            const res = await callDeletePermission(id);
            if (res && res.statusCode === 200) {
                message.success('Xóa Permission thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.error
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IPermission>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
            render: (text, record, index, action) => {
                return (
                    <a style={{ textDecoration: 'none' }} href="#" onClick={() => {
                        setOpenModalDetail(true);
                        setDataInit(record);
                    }}>
                        {record.id}
                    </a>
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
            title: 'API',
            dataIndex: 'apiPath',
            sorter: true,
        },
        {
            title: 'Method',
            dataIndex: 'method',
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <p style={{ paddingLeft: 10, fontWeight: 'bold', marginBottom: 0, color: colorMethod(entity?.method as string) }}>{entity?.method || ''}</p>
                )
            },
        },
        {
            title: 'Module',
            dataIndex: 'module',
            sorter: true,
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
                        permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.PERMISSIONS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa permission"}
                            description={"Bạn có chắc chắn muốn xóa permission này ?"}
                            onConfirm={() => handleDeletePermission(entity.id)}
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

        let parts = [];
        if (clone.name) parts.push(`name ~ '${clone.name}'`);
        if (clone.apiPath) parts.push(`apiPath ~ '${clone.apiPath}'`);
        if (clone.method) parts.push(`method ~ '${clone.method}'`);
        if (clone.module) parts.push(`module ~ '${clone.module}'`);

        clone.filter = parts.join(' and ');
        if (!clone.filter) delete clone.filter;

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;
        delete clone.name;
        delete clone.apiPath;
        delete clone.method;
        delete clone.module;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        const fields = ["name", "apiPath", "method", "module", "createdAt", "updatedAt"];

        if (sort) {
            for (const field of fields) {
                if (sort[field]) {
                    sortBy = `sort=${field},${sort[field] === 'ascend' ? 'asc' : 'desc'}`;
                    break;  // Remove this if you want to handle multiple sort parameters
                }
            }
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
                permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}
            >
                <ProTable<IPermission>
                    actionRef={tableRef}
                    headerTitle="Danh sách Permissions (Quyền Hạn)"
                    rowKey="id"
                    columns={columns}
                    request={async (params, sort, filter) => {
                        await waitTime(500);
                        const query = buildQuery(params, sort, filter);
                        const res = await callFetchPermission(query);
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
                                permission={ALL_PERMISSIONS.PERMISSIONS.CREATE}
                                hideChildren
                            >
                                <Button
                                    icon={<PlusOutlined />}
                                    type="primary"
                                    onClick={() => setOpenModalCreate(true)}
                                >
                                    Thêm mới
                                </Button>
                            </Access>
                        );
                    }}
                />
            </Access>
            <CreatePermission
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                reloadTable={reloadTable}
            />
            <UpdatePermission
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
            <DetailPermission
                open={openModalDetail}
                onClose={setOpenModalDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default TablePermission;