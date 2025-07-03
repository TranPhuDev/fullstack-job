import { useRef, useState } from 'react';
import { Button, Popconfirm, Space, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import { callFetchCompany, callDeleteCompany } from '@/services/api';
import dayjs from 'dayjs';
import CreateCompany from './create.company';
import UpdateCompany from './update.company';
import DetailCompany from './detail.company';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
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


export default function TableCompany() {
  const { message } = App.useApp();
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ICompany | null>(null);
  const [dataDetail, setDataDetail] = useState<ICompany | null>(null);
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [meta, setMeta] = useState({ page: 1, pageSize: 8, pages: 0, total: 0 });

  const columns: ProColumns<ICompany>[] = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      render: (text, record, index) => (
        <>{(index + 1) + (meta.page - 1) * (meta.pageSize)}</>
      ),
      hideInSearch: true,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      width: 70,
      render: (logo, record) => (
        <img
          src={logo ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${logo}` : defaultAvatar}
          alt={record.name}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#f0f0f0' }}
          onError={e => { e.currentTarget.src = defaultAvatar; }}
        />
      ),
      hideInSearch: true,
    },
    {
      title: 'Tên công ty',
      dataIndex: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 200,
      sorter: true,
      render: (_text, record) => (
        <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>
      ),
      hideInSearch: true,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 200,
      sorter: true,
      render: (_text, record) => (
        <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>
      ),
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
            style={{ fontSize: 20, color: '#ffa500' }}
            onClick={() => {
              setOpenModalUpdate(true);
              setDataUpdate(entity);
            }}
          />
          <Popconfirm
            placement="leftTop"
            title={"Xác nhận xóa company"}
            description={"Bạn có chắc chắn muốn xóa company này ?"}
            onConfirm={() => entity.id && handleDeleteCompany(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <span style={{ cursor: "pointer", margin: "0 10px" }}>
              <DeleteOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
            </span>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const q: any = {
      page: params.current,
      size: params.pageSize,
      filter: ""
    }

    const clone = { ...params };
    if (clone.name) q.filter = `${sfLike("name", clone.name)}`;
    if (clone.address) {
      q.filter = clone.name ?
        q.filter + " and " + `${sfLike("address", clone.address)}`
        : `${sfLike("address", clone.address)}`;
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

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDeleteCompany = async (id: string) => {
    const res = await callDeleteCompany(id);
    if (res && res.data) {
      message.success('Xóa company thành công');
      refreshTable();
    } else {
      message.error('Xóa company thất bại');
    }
  };

  return (
    <div>
      <ProTable<ICompany>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          await waitTime(500);
          const query = buildQuery(params, sort, filter);
          const res = await callFetchCompany(query);
          const data = res?.data as IModelPaginate<ICompany>;
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
        headerTitle="Table Company"
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
      <CreateCompany openModal={openModal} setOpenModal={setOpenModal} refreshTable={refreshTable} />
      <UpdateCompany openModalUpdate={openModalUpdate} setOpenModalUpdate={setOpenModalUpdate} refreshTable={refreshTable} setDataUpdate={setDataUpdate} dataUpdate={dataUpdate} />
      <DetailCompany open={openModalDetail} onClose={() => setOpenModalDetail(false)} company={dataDetail} />
    </div>
  );
}
