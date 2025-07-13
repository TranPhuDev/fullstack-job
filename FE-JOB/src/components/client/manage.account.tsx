import { Modal, Table, Tabs } from "antd";
import type { TabsProps } from 'antd';
import { useState, useEffect, use } from 'react';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { callFetchResumeByUser } from "@/services/api";
import { ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { App, Button, Col, Form, Row, Upload, Modal as AntdModal } from "antd";
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { v4 as uuidv4 } from 'uuid';
import { callUpdateUser, callUploadSingleFile, callChangePassword, fetchAccountAPI } from "@/services/api";
import { useCurrentApp } from "../context/app.context";
import defaultAvatar from '@/assets/images/default-avatar.jpg';

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data.result as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: "companyName",

        },
        {
            title: 'Job title',
            dataIndex: ["job", "name"],

        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
        },
        {
            title: 'Ngày rải CV',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: '',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a style={{ textDecoration: "none" }}
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = () => {
    const { user, setUser } = useCurrentApp();
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);
    const [dataAvatar, setDataAvatar] = useState<UploadFile[]>(user?.avatar ? [{
        uid: uuidv4(),
        name: user.avatar,
        status: 'done',
        url: user.avatar ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${user.avatar}` : defaultAvatar
    }] : []);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    // Prefill form when user changes
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                address: user.address,
            });
        }
    }, [user, form]);

    const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
        const res = await callUploadSingleFile(file, "avatar");
        if (res && res.data) {
            setDataAvatar([{
                uid: uuidv4(),
                name: res.data.fileName,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${res.data.fileName}`
            }]);
            if (onSuccess) onSuccess('ok');
        } else {
            setDataAvatar([]);
            if (onError) onError(new Error(res.message));
        }
    };

    const handleRemove = () => setDataAvatar([]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.originFileObj) {
            if (file.url) {
                setPreviewImage(file.url);
                setPreviewOpen(true);
                setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            }
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setPreviewImage(reader.result as string);
            setPreviewOpen(true);
            setPreviewTitle(file.name || (file.url ? file.url.substring(file.url.lastIndexOf('/') + 1) : ''));
        });
        reader.readAsDataURL(file.originFileObj);
    };

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ được upload file JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ảnh phải nhỏ hơn 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'error') {
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };

    type UserUpdateFormFields = {
        name: string;
        age?: number;
        gender?: string;
        address?: string;
        email: string;
        avatar?: string;
    };


    const onFinish = async (values: UserUpdateFormFields) => {
        setIsSubmit(true);
        const payload = {
            ...user,
            ...values,
            avatar: dataAvatar[0]?.name || user?.avatar,
        };
        const res = await callUpdateUser(payload);
        if (res && res.data) {
            message.success("Cập nhật thông tin thành công");
            // Fetch lại account mới nhất để cập nhật quyền
            const fresh = await fetchAccountAPI();
            if (fresh && fresh.data && fresh.data.user) {
                setUser(fresh.data.user);
            } else {
                setUser(res.data);
            }
            // KHÔNG setFieldsValue lại, để form giữ nguyên giá trị vừa update
        } else {
            message.error(res?.message || "Cập nhật thất bại");
        }
        setIsSubmit(false);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            // initialValues is not needed, we use setFieldsValue
            onFinish={onFinish}
            style={{ width: '100%' }}
        >
            <Row gutter={24}>
                <Col xs={24} sm={24} md={8}>
                    <Form.Item label="Avatar" name="avatar" valuePropName="fileList" getValueFromEvent={() => dataAvatar}>
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            showUploadList={true}
                            customRequest={handleUpload}
                            fileList={dataAvatar}
                            onRemove={handleRemove}
                            onPreview={handlePreview}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {dataAvatar.length >= 1 ? null : <div>Upload</div>}
                        </Upload>
                        <AntdModal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                            <img alt="avatar" style={{ width: '100%' }} src={previewImage} />
                        </AntdModal>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={16}>
                    <ProFormText
                        label="Email"
                        name="email"
                        disabled
                    />
                    <ProFormText
                        label="Tên hiển thị"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                        placeholder="Nhập tên hiển thị"
                    />
                    <ProFormDigit
                        label="Tuổi"
                        name="age"
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                        placeholder="Nhập tuổi"
                    />
                    <ProFormSelect
                        name="gender"
                        label="Giới tính"
                        valueEnum={{ MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' }}
                        placeholder="Chọn giới tính"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    />
                    <ProFormText
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                        placeholder="Nhập địa chỉ"
                    />
                    <Button type="primary" htmlType="submit" loading={isSubmit} style={{ marginTop: 16 }}>
                        Cập nhật
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

const UserUpdatePassword = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        setIsSubmit(true);
        try {
            const res = await callChangePassword(values.currentPassword, values.newPassword);
            if (res && res.statusCode === 200) {
                message.success("Đổi mật khẩu thành công");
                form.resetFields();
            } else {
                message.error(res?.message || "Mật khẩu cũ không đúng vui lòng thử lại");
            }
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
                message.error((err as { message: string }).message || "Mật khẩu cũ không đúng vui lòng thử lại");
            } else {
                message.error("Mật khẩu cũ không đúng vui lòng thử lại");
            }
        }
        setIsSubmit(false);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 400, margin: '0 auto' }}
        >
            <Form.Item
                label="Mật khẩu cũ"
                name="currentPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
            >
                <ProFormText.Password placeholder="Nhập mật khẩu cũ" />
            </Form.Item>
            <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
            >
                <ProFormText.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item
                label="Nhập lại mật khẩu mới"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                    { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                        },
                    }),
                ]}
            >
                <ProFormText.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmit} style={{ marginTop: 16, width: '100%' }}>
                Đổi mật khẩu
            </Button>
        </Form>
    );
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Rải CV`,
            children: <UserResume />,
        },

        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: <UserUpdatePassword />,
        },
    ];


    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width="1000px"
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;