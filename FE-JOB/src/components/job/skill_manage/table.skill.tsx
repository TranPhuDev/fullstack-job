import { useRef, useState } from 'react';
import { ProTable, type ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { sfLike } from 'spring-filter-query-builder';
import { callFetchAllSkill, callDeleteSkill } from '@/services/api';
import CreateSkill from './create.skill';
import UpdateSkill from './update.skill';
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
export default function TableSkill() {
    const { message } = App.useApp();
    const actionRef = useRef<ActionType | undefined>(undefined);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<ISkill | null>(null);

    const columns: ProColumns<ISkill>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            render: (_text, _record, index, action) => {
                return <>{(index + 1) + ((action?.pageInfo?.current || 1) - 1) * (action?.pageInfo?.pageSize || 10)}</>;
            },
            hideInSearch: true,
        },
        {
            title: 'Tên kỹ năng',
            dataIndex: 'name',
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            hideInSearch: true,
        },
        {
            title: 'Người cập nhật',
            dataIndex: 'updatedBy',
            hideInSearch: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 180,
            render: (_text, record) => record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : '',
            hideInSearch: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            width: 180,
            render: (_text, record) => record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : '',
            hideInSearch: true,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            hideInSearch: true,
            render: (_text, record) => (
                <Space>
                    <EditOutlined
                        style={{ color: '#ffa500', fontSize: 18, cursor: 'pointer' }}
                        onClick={() => {
                            setDataUpdate(record);
                            setOpenModalUpdate(true);
                        }}
                    />
                    <Popconfirm
                        title="Xác nhận xóa kỹ năng?"
                        onConfirm={async () => {
                            if (record.id) {
                                const res = await callDeleteSkill(record.id);
                                if (res?.statusCode === 200) {
                                    message.success('Xóa kỹ năng thành công');
                                    actionRef.current?.reload();
                                } else {
                                    message.error(res?.message || 'Xóa thất bại');
                                }
                            }
                        }}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 18, cursor: 'pointer' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: Record<string, unknown>, sort: Record<string, unknown>) => {
        const q: Record<string, unknown> = {
            page: params.current,
            size: params.pageSize,
            filter: '',
        };
        if (params.name) q.filter = sfLike('name', params.name as string);
        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);
        let sortBy = '';
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? 'sort=name,asc' : 'sort=name,desc';
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? 'sort=createdAt,asc' : 'sort=createdAt,desc';
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? 'sort=updatedAt,asc' : 'sort=updatedAt,desc';
        }
        if (!sortBy) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        } 
        return temp;
    };

    return (
        <>
            <ProTable<ISkill>
                columns={columns}
                actionRef={actionRef}
                rowKey="id"
                search={{ labelWidth: 'auto' }}
                pagination={{ showQuickJumper: true }}
                request={async (params: Record<string, unknown>, sort: Record<string, unknown>) => {
                    await waitTime(500);
                    const query = buildQuery(params, sort);
                    const res = await callFetchAllSkill(query);
                    return {
                        data: res?.data?.result || [],
                        success: true,
                        total: res?.data?.meta?.total || 0,
                    };
                }}
                toolBarRender={() => [
                    <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
                        Thêm mới
                    </Button>,
                ]}
                
            />  
            
            <CreateSkill openModal={openModal} setOpenModal={setOpenModal} refreshTable={() => actionRef.current?.reload()} />
            <UpdateSkill openModalUpdate={openModalUpdate} setOpenModalUpdate={setOpenModalUpdate} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate} refreshTable={() => actionRef.current?.reload()} />
        </>
    );
}
