import { Drawer, Descriptions, Tag } from 'antd';
import defaultAvatar from '@/assets/images/default-avatar.jpg';

interface detailJobProps {
    openModalDetail: boolean;
    setOpenModalDetail: (open: boolean) => void;
    dataDetail: IJob | null;
}

const DetailJob = ({ openModalDetail, setOpenModalDetail, dataDetail }: detailJobProps) => {
    const companyLogo = dataDetail?.company?.logo
        ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${dataDetail.company.logo}`
        : defaultAvatar;
    return (
        <Drawer
            title="Chi tiết Job"
            placement="right"
            onClose={() => setOpenModalDetail(false)}
            open={openModalDetail}
            width={500}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <img
                    src={companyLogo}
                    alt={dataDetail?.company?.name}
                    style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, border: '1px solid #eee' }}
                />
                <div style={{ fontWeight: 600, fontSize: 20 }}>{dataDetail?.name}</div>
                <div style={{ color: '#888', marginBottom: 8 }}>{dataDetail?.company?.name}</div>
            </div>
            <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Tên Job">{dataDetail?.name}</Descriptions.Item>
                <Descriptions.Item label="Công ty">{dataDetail?.company?.name}</Descriptions.Item>
                <Descriptions.Item label="Địa điểm">{dataDetail?.location}</Descriptions.Item>
                <Descriptions.Item label="Mức lương">{dataDetail?.salary?.toLocaleString()} đ</Descriptions.Item>
                <Descriptions.Item label="Số lượng">{dataDetail?.quantity}</Descriptions.Item>
                <Descriptions.Item label="Level">{dataDetail?.level}</Descriptions.Item>
                <Descriptions.Item label="Workplace">{dataDetail?.workplace}</Descriptions.Item>
                <Descriptions.Item label="Expertise">{dataDetail?.expertise}</Descriptions.Item>
                <Descriptions.Item label="Kỹ năng">
                    {dataDetail?.skills?.map(skill => (
                        <Tag key={skill.id}>{skill.name}</Tag>
                    ))}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                    <div style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: dataDetail?.description || '' }} />
                </Descriptions.Item>
                <Descriptions.Item label="Ngày bắt đầu">{dataDetail?.startDate ? new Date(dataDetail.startDate).toLocaleDateString() : ''}</Descriptions.Item>
                <Descriptions.Item label="Ngày kết thúc">{dataDetail?.endDate ? new Date(dataDetail.endDate).toLocaleDateString() : ''}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={dataDetail?.active ? 'lime' : 'red'}>
                        {dataDetail?.active ? 'ACTIVE' : 'INACTIVE'}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">{dataDetail?.createdAt ? new Date(dataDetail.createdAt).toLocaleString() : ''}</Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">{dataDetail?.updatedAt ? new Date(dataDetail.updatedAt).toLocaleString() : ''}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default DetailJob;