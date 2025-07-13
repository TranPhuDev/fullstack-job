import { useRef, useState } from 'react';
import { Button, Space, Popconfirm, Tag, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProFormSelect, ProTable } from '@ant-design/pro-components';
import dayjs from 'dayjs';

// Giả sử bạn đã có các API sau:
import { callFetchJob, callDeleteJob } from '@/services/api';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import DetailJob from './detail.job';
import Access from '@/share/Access';
import { ALL_PERMISSIONS } from '@/services/permissions';
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




export default function TableJob() {
    const { message } = App.useApp();
    const actionRef = useRef<ActionType | undefined>(undefined);
    const [meta, setMeta] = useState({ page: 1, pageSize: 8, pages: 0, total: 0 });
    const navigate = useNavigate();
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState<IJob | null>(null);

    const columns: ProColumns<IJob>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            render: (_text, _record, index) => (
                <>{(index + 1) + (meta.page - 1) * (meta.pageSize)}</>
            ),
            hideInSearch: true,
        },
        {
            title: 'Tên job',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Công ty',
            dataIndex: 'companyName',
            sorter: true,
        },
        {
            title: 'Mức lương',
            dataIndex: 'salary',
            sorter: true,
            render(_dom, entity) {
                const str = "" + entity.salary;
                return <>{str?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</>
            },
        },
        {
            title: 'Level',
            dataIndex: 'level',
            renderFormItem: () => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        INTERN: 'INTERN',
                        FRESHER: 'FRESHER',
                        JUNIOR: 'JUNIOR',
                        MIDDLE: 'MIDDLE',
                        SENIOR: 'SENIOR',
                    }}
                    placeholder="Chọn level"
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            hideInSearch: true,
            render(_dom, entity) {
                return <>
                    <Tag color={entity.active ? "lime" : "red"} >
                        {entity.active ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                </>
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            sorter: true,
            width: 180,
            render: (_text, record) => (
                <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>
            ),
            hideInSearch: true,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            sorter: true,
            width: 180,
            render: (_text, record) => (
                <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>
            ),
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 100,
            render: (_value, entity) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.JOBS.DETAIL}
                        hideChildren
                    >
                        <EyeOutlined
                            style={{ fontSize: 20, marginRight: 10, color: '#1677ff', cursor: 'pointer' }}
                            onClick={() => {
                                setDataDetail(entity);
                                setOpenModalDetail(true);
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.JOBS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{ fontSize: 20, color: '#ffa500' }}
                            onClick={() => {
                                navigate(`/admin/job/upsert?id=${entity.id}`)
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.JOBS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa job"}
                            description={"Bạn có chắc chắn muốn xóa job này ?"}
                            onConfirm={() => entity.id && handleDeleteJob(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: Record<string, unknown>, sort: Record<string, unknown>) => {
        const q: Record<string, unknown> = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        };

        // Tìm kiếm theo tên job
        if (params.name) q.filter = sfLike("name", params.name as string);

        // Tìm kiếm theo tên công ty (giả sử backend hỗ trợ filter theo company.name)
        if (params.companyName) {
            q.filter = q.filter
                ? q.filter + " and " + sfLike("company.name", params.companyName as string)
                : sfLike("company.name", params.companyName as string);
        }

        // Tìm kiếm theo mức lương (salary)
        if (params.salary) {
            q.filter = q.filter
                ? q.filter + " and " + sfLike("salary", params.salary as string)
                : sfLike("salary", params.salary as string);
        }

        // Tìm kiếm theo level (có thể là 1 hoặc nhiều giá trị)
        if (params.level) {
            if (Array.isArray(params.level)) {
                const levelFilter = params.level.map((lv: string) => sfLike("level", lv)).join(" or ");
                q.filter = q.filter
                    ? q.filter + " and (" + levelFilter + ")"
                    : "(" + levelFilter + ")";
            } else {
                q.filter = q.filter
                    ? q.filter + " and " + sfLike("level", params.level as string)
                    : sfLike("level", params.level as string);
            }
        }

        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.salary) {
            sortBy = sort.salary === 'ascend' ? "sort=salary,asc" : "sort=salary,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        if (!sortBy) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

    const refreshTable = () => {
        actionRef.current?.reload();
    };

    const handleDeleteJob = async (id: string) => {
        const res = await callDeleteJob(id);
        if (res.statusCode === 200) {
            message.success('Xóa job thành công');
            refreshTable();
        } else {
            message.error('Xóa job thất bại');
        }
    };

    return (
        <>
            <div>
                <Access
                    permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}
                >
                    <ProTable<IJob>
                        columns={columns}
                        actionRef={actionRef}
                        cardBordered

                        request={async (params, sort) => {
                            await waitTime(500);
                            const query = buildQuery(params, sort);
                            const res = await callFetchJob(query);
                            const data = res?.data;
                            if (data && data.meta) {
                                setMeta(data.meta);
                            }
                            // Nếu mỗi job có trường company là object, map lại để lấy companyName (dùng cho hiển thị, không thay đổi kiểu IJob)
                            const jobs = data?.result?.map((job: IJob) => ({
                                ...job,
                                companyName: job.company && typeof job.company === 'object' && 'name' in job.company ? (job.company as { name?: string }).name || '' : '',
                            }));
                            return {
                                data: jobs, // dùng jobs đã map
                                success: true,
                                total: data?.meta?.total,
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
                        headerTitle="Table Job"
                        toolBarRender={() => [
                            <Access
                                permission={ALL_PERMISSIONS.JOBS.CREATE}
                                hideChildren
                            >
                                <Button
                                    key="button"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate('upsert')}
                                    type="primary"
                                >
                                    Thêm mới
                                </Button>
                            </Access>
                        ]}
                    />
                </Access>
            </div>

            <DetailJob openModalDetail={openModalDetail} setOpenModalDetail={setOpenModalDetail} dataDetail={dataDetail} />
        </>
    );
}
