import { Modal, Form, Input, Upload, Col, Row, App } from 'antd';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { callUpdateCompany, callUploadSingleFile } from '@/services/api';
import { ProCard, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Editor } from '@tinymce/tinymce-react';
import { FIELD_OPTIONS, OVERTIME_OPTIONS, SCALE_OPTIONS, WORKING_TIME_OPTIONS } from './create.company';

interface CompanyData {
  id?: string;
  name?: string;
  address?: string;
  workingTime?: string;
  field?: string;
  scale?: string;
  overTime?: string;
  description?: string;
  logo: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateCompanyProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (open: boolean) => void;
  refreshTable: () => void;
  dataUpdate: CompanyData | null;
  setDataUpdate: (data: CompanyData | null) => void;
}

const UpdateCompany = ({ openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdate, setDataUpdate }: UpdateCompanyProps) => {
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [logo, setLogo] = useState<UploadFile[]>([]);
  const [description, setDescription] = useState<string>("");
  useEffect(() => {
    if (dataUpdate) {
      const formValue = {
        ...dataUpdate,
        workingTime: WORKING_TIME_OPTIONS.find(opt => opt.label === dataUpdate.workingTime)?.value,
        field: FIELD_OPTIONS.find(opt => opt.label === dataUpdate.field)?.value,
        scale: SCALE_OPTIONS.find(opt => opt.label === dataUpdate.scale)?.value,
        overTime: OVERTIME_OPTIONS.find(opt => opt.label === dataUpdate.overTime)?.value,
      };
      console.log('Form Value:', formValue);
      form.setFieldsValue(formValue);
      setDescription(dataUpdate.description || "");
      if (dataUpdate.logo) {
        setLogo([{ uid: uuidv4(), name: dataUpdate.logo, status: 'done', url: `${import.meta.env.VITE_BACKEND_URL}/storage/company/${dataUpdate.logo}` }]);
      } else {
        setLogo([]);
      }
    } else {
      form.resetFields();
      setLogo([]);
      setDescription("");
    }
  }, [openModalUpdate, dataUpdate, form]);
  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    const res = await callUploadSingleFile(file, 'avatar');
    if (res && res.data) {
      setLogo([{ uid: uuidv4(), name: res.data.fileName, status: 'done', url: `${import.meta.env.VITE_BACKEND_URL}/storage/company/${res.data.fileName}` }]);
      if (onSuccess) onSuccess('ok');
    } else {
      setLogo([]);
      if (onError) onError(new Error(res.message));
    }
  };
  const handleRemove = () => setLogo([]);
  const onFinish = async (values: Omit<CompanyData, 'id' | 'logo' | 'createdAt' | 'updatedAt'>) => {
    if (!dataUpdate) return;
    setIsSubmit(true);
    const res = await callUpdateCompany(
      dataUpdate.id || '',
      values.name || '',
      values.address || '',
      values.workingTime || '',
      values.field || '',
      values.scale || '',
      values.overTime || '',
      description ?? '',
      logo[0]?.name || ''
    );
    if (res && res.data) {
      message.success('Cập nhật công ty thành công');
      setOpenModalUpdate(false);
      setDataUpdate(null);
      form.resetFields();
      setLogo([]);
      setDescription("");
      refreshTable();
    } else {
      message.error('Cập nhật công ty thất bại');
    }
    setIsSubmit(false);
  };
  return (
    <Modal width={900} open={openModalUpdate} onCancel={() => { setOpenModalUpdate(false); setDataUpdate(null); form.resetFields(); setLogo([]); setDescription(""); }} onOk={() => form.submit()} confirmLoading={isSubmit} title="Cập nhật công ty">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12} md={12}>
            <ProFormText
              label="Tên công ty"
              name="name"
              placeholder="Nhập tên công ty"
              rules={[{ required: true, message: 'Không bỏ trống' }]}
            />
          </Col>
          <Col span={12} md={12}>
            <ProFormText
              label="Địa chỉ"
              name="address"
              placeholder="Nhập địa chỉ"
              rules={[{ required: true, message: 'Không bỏ trống' }]}
            />
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
            beforeUpload={file => ['image/jpeg', 'image/png'].includes(file.type)}
          >{logo.length >= 1 ? null : <div>Upload</div>}</Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCompany; 