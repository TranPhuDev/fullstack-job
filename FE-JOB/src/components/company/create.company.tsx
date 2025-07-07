import { Modal, Form, Input, Upload, Col, Row, FormProps, App } from 'antd';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { callCreateCompany, callUploadSingleFile } from '@/services/api';
import { ProCard, ProFormSelect } from '@ant-design/pro-components';
import { Editor } from '@tinymce/tinymce-react';

export const WORKING_TIME_OPTIONS = [
  { label: 'Thứ 2 - Thứ 6', value: 'Thứ 2 - Thứ 6' },
  { label: 'Thứ 2 - Thứ 7', value: 'Thứ 2 - Thứ 7' },
  { label: 'Cả tuần', value: 'Cả tuần' },
];

export const FIELD_OPTIONS = [
  { label: 'Công nghệ', value: 'Công nghệ' },
  { label: 'Tài chính', value: 'Tài chính' },
  { label: 'Chăm sóc sức khỏe', value: 'Chăm sóc sức khỏe' },
  { label: 'Giáo dục', value: 'Giáo dục' },
];
export const SCALE_OPTIONS = [
  { label: '1-50', value: '1-50' },
  { label: '50-100', value: '50-100' },
  { label: '1000+', value: '1000+' },
];

export const OVERTIME_OPTIONS = [
  { label: 'OT có tăng lương', value: 'OT có tăng lương' },
  { label: 'OT không tăng lương', value: 'OT không tăng lương' },
  { label: 'Không có OT', value: 'Không có OT' },
];

type FieldType = {
  name?: string;
  address?: string;
  description?: string;
  logo?: string[];
  workingTime?: string;
  field?: string;
  scale?: string;
  overTime?: string;
}

interface CreateCompanyProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  refreshTable: () => void;
}

const CreateCompany = ({ openModal, setOpenModal, refreshTable }: CreateCompanyProps) => {
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
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

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const res = await callCreateCompany(values);
    if (res && res.data) {
      message.success("Tạo mới công ty thành công");
      setOpenModal(false);
      form.resetFields();
      setLogo([]);
      setDescription('');
      refreshTable();
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: res.message || 'Có lỗi xảy ra khi tạo mới công ty',
      });
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
          <Col span={24} md={6}>
            <ProFormSelect
              name="workingTime"
              label="Thời gian làm việc"
              options={WORKING_TIME_OPTIONS}
              placeholder="Chọn thời gian làm việc"
              rules={[{ required: true, message: "Vui lòng chọn thời gian làm việc!" }]}
            />
          </Col>
          <Col span={24} md={6}>
            <ProFormSelect
              name="field"
              label="Lĩnh vực"
              options={FIELD_OPTIONS}
              placeholder="Chọn lĩnh vực"
              rules={[{ required: true, message: "Vui lòng chọn lĩnh vực!" }]}
            />
          </Col>
          <Col span={24} md={6}>
            <ProFormSelect
              name="scale"
              label="Quy mô"
              options={SCALE_OPTIONS}
              placeholder="Chọn quy mô"
              rules={[{ required: true, message: "Vui lòng chọn quy mô!" }]}
            />
          </Col>
          <Col span={24} md={6}>
            <ProFormSelect
              name="overTime"
              label="Làm thêm giờ"
              options={OVERTIME_OPTIONS}
              placeholder="Chọn làm thêm giờ"
              rules={[{ required: true, message: "Vui lòng chọn làm thêm giờ!" }]}
            />
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
