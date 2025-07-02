import { Drawer, Descriptions } from 'antd';
import defaultAvatar from 'assets/images/default-avatar.jpg';

interface CompanyData {
  id?: string;
  name?: string;
  address?: string;
  description?: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DetailCompanyProps {
  open: boolean;
  onClose: () => void;
  company: CompanyData | null;
}

const DetailCompany = ({ open, onClose, company }: DetailCompanyProps) => {
  return (
    <Drawer
      title="Chi tiết công ty"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <img
          src={company?.logo ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${company.logo}` : defaultAvatar}
          alt={company?.name}
          style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, border: '1px solid #eee' }}
        />
        <div style={{ fontWeight: 600, fontSize: 20 }}>{company?.name}</div>
        <div style={{ color: '#888', marginBottom: 8 }}>{company?.address}</div>
      </div>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Tên công ty">{company?.name}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{company?.address}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          <div
            style={{ whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: company?.description || '' }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{company?.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">{company?.updatedAt}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailCompany; 