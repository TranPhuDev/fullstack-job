import { EditOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProFormSelect, ProTable } from '@ant-design/pro-components';
import { App, Space } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { callFetchResume } from '@/services/api'; // sẽ tạo nếu chưa có
import { sfIn } from 'spring-filter-query-builder';
import queryString from 'query-string';
import UpdateResume from './update.resume';
import Access from '@/share/access';
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
export default function TableResume() {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [meta, setMeta] = useState({ page: 1, pageSize: 8, pages: 0, total: 0 });
  const reloadTable = () => {
    actionRef.current?.reload();
  };
  const [dataInit, setDataInit] = useState<IResume | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const columns: ProColumns<IResume>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      sorter: true,
      renderFormItem: (item, props, form) => (
        <ProFormSelect
          showSearch
          mode="multiple"
          allowClear
          valueEnum={{
            PENDING: 'PENDING',
            REVIEWING: 'REVIEWING',
            APPROVED: 'APPROVED',
            REJECTED: 'REJECTED',
          }}
          placeholder="Chọn trạng thái"
        />
      ),
    },
    {
      title: 'Tên Job',
      dataIndex: ['job', 'name'],
      hideInSearch: true,
    },
    {
      title: 'Company',
      dataIndex: ['companyName'],
      width: 200,
      hideInSearch: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 160,
      render: (_text, record) => record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : '',
      hideInSearch: true,
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      width: 160,
      render: (_text, record) => record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : '',
      hideInSearch: true,
    },
    {
      title: 'Actions',
      hideInSearch: true,
      width: 70,
      render: (_value, entity) => (
        <Space>
          <Access
            permission={ALL_PERMISSIONS.RESUMES.UPDATE}
            hideChildren
          >
            <EditOutlined style={{ fontSize: 20, color: '#ffa500', cursor: 'pointer' }} onClick={() => { setOpenViewDetail(true); setDataInit(entity); }} />

          </Access>
        </Space>

      ),
    },
  ];



  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };

    if (clone?.status?.length) {
      clone.filter = sfIn("status", clone.status).toString();
      delete clone.status;
    }

    clone.page = clone.current;
    clone.size = clone.pageSize;

    delete clone.current;
    delete clone.pageSize;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.status) {
      sortBy = sort.status === 'ascend' ? "sort=status,asc" : "sort=status,desc";
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

    // temp += "&populate=companyId,jobId&fields=companyId.id, companyId.name, companyId.logo, jobId.id, jobId.name";
    return temp;
  }


  return (
    <div>
      <Access
        permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}
      >
        <ProTable<IResume>
          columns={columns}
          headerTitle=" Resumes"
          actionRef={actionRef}
          cardBordered
          search={{ labelWidth: 'auto' }}
          request={async (params, sort, filter) => {
            await waitTime(500);

            const query = buildQuery(params, sort, filter);
            const res = await callFetchResume(query);
            const data = res?.data as IModelPaginate<IResume>;
            if (data) setMeta(data.meta);
            return {
              data: data?.result || [],
              page: 1,
              success: true,
              total: meta.total || 0,
            };
          }}
          rowKey="id"
          pagination={
            {
              current: meta.page,
              pageSize: meta.pageSize,
              showSizeChanger: true,
              total: meta.total,
              showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
            }
          }
          scroll={{ x: true }}
          rowSelection={false}
          toolBarRender={(_action, _rows): any => {
            return (
              <></>
            );
          }}
          bordered
        />
      </Access>
      <UpdateResume
        open={openViewDetail}
        onClose={setOpenViewDetail}
        dataInit={dataInit}
        setDataInit={setDataInit}
        reloadTable={reloadTable}
      />
    </div>
  );
}
