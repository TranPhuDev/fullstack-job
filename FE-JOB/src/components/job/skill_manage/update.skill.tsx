import { Modal, Form, Input, App } from 'antd';
import { callUpdateSkill } from '@/services/api';
import { useEffect, useState } from 'react';

interface UpdateSkillProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  dataUpdate: ISkill | null;
  setDataUpdate: (v: ISkill | null) => void;
  refreshTable: () => void;
}

const UpdateSkill = ({ openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate, refreshTable }: UpdateSkillProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (openModalUpdate && dataUpdate) {
      form.setFieldsValue({ name: dataUpdate.name });
    } else {
      form.resetFields();
    }
  }, [openModalUpdate, dataUpdate, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!dataUpdate?.id) return;
      setLoading(true);
      const res = await callUpdateSkill({ name: values.name }, dataUpdate.id);
      if (res && res.data) {
        message.success('Cập nhật kỹ năng thành công');
        setOpenModalUpdate(false);
        setDataUpdate(null);
        form.resetFields();
        refreshTable();
      } else {
        message.error(res?.message || 'Cập nhật kỹ năng thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpenModalUpdate(false);
    setDataUpdate(null);
    form.resetFields();
  };

  return (
    <Modal
      title="Cập nhật kỹ năng"
      open={openModalUpdate}
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

export default UpdateSkill;
