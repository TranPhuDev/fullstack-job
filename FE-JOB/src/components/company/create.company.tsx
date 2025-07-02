import { Modal, Form, Input, Upload, Col, Row } from 'antd';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { callCreateCompany, callUploadSingleFile } from '@/services/api';
import { ProCard } from '@ant-design/pro-components';
import { Editor } from '@tinymce/tinymce-react';

interface CreateCompanyProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  refreshTable: () => void;
}

const CreateCompany = ({ openModal, setOpenModal, refreshTable }: CreateCompanyProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [logo, setLogo] = useState<UploadFile[]>([]);
  const [description, setDescription] = useState<string>(''); // <- lưu mô tả từ TinyMCE

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    const res = await callUploadSingleFile(file, 'company');
    if (res && res.data) {
      setLogo([
        {
          uid: uuidv4(),
          name: res.data.fileName,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/storage/company/${res.data.fileName}`,
        },
      ]);
      if (onSuccess) onSuccess('ok');
    } else {
      setLogo([]);
      if (onError) onError(new Error(res.message));
    }
  };

  const handleRemove = () => setLogo([]);

  const onFinish = async (values: { name: string; address: string }) => {
    setIsSubmit(true);
    const res = await callCreateCompany(
      values.name,
      values.address,
      description ?? '',
      logo[0]?.name || ''
    );
    if (res && res.data) {
      setOpenModal(false);
      form.resetFields();
      setLogo([]);
      setDescription('');
      refreshTable();
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      width={900}
      open={openModal}
      onCancel={() => {
        setOpenModal(false);
        form.resetFields();
        setLogo([]);
        setDescription('');
      }}
      onOk={() => form.submit()}
      confirmLoading={isSubmit}
      title="Thêm mới công ty"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên công ty"
              name="name"
              rules={[{ required: true, message: 'Không bỏ trống' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Không bỏ trống' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <ProCard title="Mô tả" style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Editor
              value={description}
              onEditorChange={(content) => setDescription(content)}
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              init={{
                height: 200,
                menubar: false,
                plugins: ['lists link image table code wordcount'],
                toolbar:
                  'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | outdent indent | removeformat',
              }}
            />
          </Col>
        </ProCard>
        <Form.Item label="Logo">
          <Upload
            name="logo"
            listType="picture-circle"
            showUploadList={true}
            customRequest={handleUpload}
            fileList={logo}
            onRemove={handleRemove}
            beforeUpload={(file) => ['image/jpeg', 'image/png'].includes(file.type)}
          >
            {logo.length >= 1 ? null : <div>Upload</div>}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCompany;
