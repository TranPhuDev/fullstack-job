import { Modal, Form, Input, App } from 'antd';
import { callCreateSkill } from '@/services/api';
import { useState } from 'react';

interface CreateSkillProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  refreshTable: () => void;
}

const CreateSkill = ({ openModal, setOpenModal, refreshTable }: CreateSkillProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await callCreateSkill({ name: values.name });
      if (res && res.data) {
        message.success('Tạo kỹ năng thành công');
        setOpenModal(false);
        form.resetFields();
        refreshTable();
      } else {
        message.error(res?.message || 'Tạo kỹ năng thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Thêm kỹ năng mới"
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên kỹ năng"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên kỹ năng' }]}
        >
          <Input placeholder="Nhập tên kỹ năng" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSkill;
