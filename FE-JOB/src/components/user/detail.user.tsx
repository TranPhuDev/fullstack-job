import { Drawer, Descriptions, Avatar } from 'antd';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import React from 'react';

interface DetailUserProps {
  open: boolean;
  onClose: () => void;
  user: IUser | null;
}

const DetailUser: React.FC<DetailUserProps> = ({ open, onClose, user }) => {
  const isValidAvatar = user?.avatar && user.avatar !== '-' && user.avatar !== 'null';
  return (
    <Drawer
      title="Chi tiết người dùng"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <Avatar
          size={96}
          src={isValidAvatar ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${user?.avatar}` : defaultAvatar}
          alt={user?.name}
          style={{ marginBottom: 16 }}
        />
        <div style={{ fontWeight: 600, fontSize: 20 }}>{user?.name}</div>
        <div style={{ color: '#888', marginBottom: 8 }}>{user?.email}</div>
      </div>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Tên hiển thị">{user?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">{user?.role?.name}</Descriptions.Item>
        <Descriptions.Item label="Công ty">{user?.company?.name}</Descriptions.Item>
        <Descriptions.Item label="Tuổi">{user?.age}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{user?.gender}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{user?.address}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{user?.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">{user?.updatedAt}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailUser;
