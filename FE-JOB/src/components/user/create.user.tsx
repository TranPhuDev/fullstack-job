import { ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { App, Button, Col, Divider, Form, Input, Modal, Row, Upload } from "antd";
import { FormProps } from "antd";
import { useState, useEffect } from "react";
import { DebounceSelect } from "./debounce.select";
import { callCreateUser, callFetchCompany, callFetchRole, callUploadSingleFile } from "@/services/api";
import { v4 as uuidv4 } from 'uuid';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import defaultAvatar from 'assets/images/default-avatar.jpg'

// import { createUserAPI } from "services/api";


interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name?: string;
    email?: string;
    password?: string;
    gender?: string;
    age?: string
    phone?: string;
    avatar?: string;
    role?: ICompanySelect;
    company?: ICompanySelect;
};


export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

interface IAvatarUser {
    name: string;
    uid: string;
}


const CreateUser = (props: IProps) => {


    const { openModal, setOpenModal, refreshTable } = props;

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { message, notification } = App.useApp();

    const [dataAvatar, setDataAvatar] = useState<IAvatarUser[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');







    //gui form
    const [form] = Form.useForm();

    useEffect(() => {
        if (openModal) {
            setDataAvatar([]);
        }
    }, [openModal]);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true)

        const payload = {
            ...values,
            role: values.role ? { id: values.role.value } : undefined,
            company: values.company ? { id: values.company.value } : undefined,
            avatar: dataAvatar[0]?.name
        };

        const res = await callCreateUser(payload);

        console.log(values)
        // success
        if (res && res.data) {
            message.success("Tạo mới user thành công")
            form.resetFields();
            setOpenModal(false);
            refreshTable();
        } else {
            notification.error({ message: "Đã có lỗi xảy ra", description: res.message })
        }

        setIsSubmit(false)
    };

    const fetchCompanyList = async (name: string): Promise<ICompanySelect[]> => {
        const res = await callFetchCompany(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            return res.data.result.map((item: any) => ({
                label: item.name as string,
                value: item.id as string
            }));
        }
        return [];
    };

    const fetchRoleList = async (name: string): Promise<ICompanySelect[]> => {
        const res = await callFetchRole(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            return res.data.result.map((item: any) => ({
                label: item.name as string,
                value: item.id as string
            }));
        }
        return [];
    };

    //upload file 
    const handleUploadFileLogo: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
        const res = await callUploadSingleFile(file, "avatar");
        if (res && res.data) {
            setDataAvatar([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setDataAvatar([])
                const error = new Error(res.message);
                onError(error);
            }
        }
    };

    const handleRemoveFile = () => {
        setDataAvatar([])
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.originFileObj) {
            if (file.url) {
                setPreviewImage(file.url);
                setPreviewOpen(true);
                setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            }
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url || '');
            setPreviewOpen(true);
            setPreviewTitle(file.name || (file.url ? file.url.substring(file.url.lastIndexOf('/') + 1) : ''));
        });
    };

    const getBase64 = (img: File | Blob, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            // setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            // setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            // setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };


    return (
        <>
            <Modal width={900}
                keyboard={false}
                maskClosable={false}
                title="Add New User"
                open={openModal}
                onCancel={() => { setOpenModal(false); form.resetFields(); setDataAvatar([]); }}
                onOk={() => { form.submit() }}
                confirmLoading={isSubmit}
                okText={"Tạo mới"}
                cancelText={"Hủy"}

            >

                <Form
                    //them thuoc tinh form moi lay dc gia tri tu nut submit
                    form={form}
                    name="form-register"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Row gutter={16}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng không bỏ trống' },
                                    { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                                ]}
                                placeholder="Nhập email"
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText.Password
                                disabled={false}
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập password"
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormText
                                label="Tên hiển thị"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập tên hiển thị"
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormDigit
                                label="Tuổi"
                                name="age"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập nhập tuổi"
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormSelect
                                name="gender"
                                label="Giới Tính"
                                valueEnum={{
                                    MALE: 'Nam',
                                    FEMALE: 'Nữ',
                                    OTHER: 'Khác',
                                }}
                                placeholder="Chọn giới tính"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProForm.Item
                                name="role"
                                label="Vai trò"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}

                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    placeholder="Chọn vai trò"
                                    fetchOptions={fetchRoleList}
                                    value={form.getFieldValue('role')}
                                    onChange={(newValue) => {
                                        form.setFieldValue('role', newValue || undefined);
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>

                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProForm.Item
                                name="company"
                                label="Thuộc Công Ty"
                                rules={[{ required: true, message: 'Vui lòng chọn company!' }]}
                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    placeholder="Chọn công ty"
                                    fetchOptions={fetchCompanyList}
                                    value={form.getFieldValue('company')}
                                    onChange={(newValue) => {
                                        form.setFieldValue('company', newValue || undefined);
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập địa chỉ"
                            />
                        </Col>
                        <Col span={24} style={{ marginTop: 16 }}>
                            <Form.Item label="Avatar" name="avatar">
                                <Upload
                                    name="avatar"
                                    listType="picture-circle"
                                    showUploadList={true}
                                    customRequest={handleUploadFileLogo}
                                    fileList={dataAvatar.map(item => ({
                                        uid: item.uid,
                                        name: item.name,
                                        status: 'done',
                                        url: item.name ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${item.name}` : defaultAvatar
                                    }))}
                                    onRemove={handleRemoveFile}
                                    onPreview={handlePreview}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                >
                                    {dataAvatar.length >= 1 ? null : <div>Upload</div>}
                                </Upload>
                                <Modal
                                    open={previewOpen}
                                    title={previewTitle}
                                    footer={null}
                                    onCancel={() => setPreviewOpen(false)}
                                >
                                    <img alt="avatar" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal >
        </>
    )

}


export default CreateUser

