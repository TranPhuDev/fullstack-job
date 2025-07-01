import { ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { App, Button, Col, Divider, Form, Input, Modal, Row } from "antd";
import { FormProps } from "antd";
import { useState } from "react";
import { DebounceSelect } from "./debounce.select";
import { callCreateUser, callFetchCompany, callFetchRole } from "@/services/api";
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
    role?: ICompanySelect;
    company?: ICompanySelect;
};


export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}


const CreateUser = (props: IProps) => {


    const { openModal, setOpenModal, refreshTable } = props;

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { message, notification } = App.useApp();





    //gui form
    const [form] = Form.useForm();


    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true)

        const payload = {
            ...values,
            role: values.role ? { id: values.role.value } : undefined,
            company: values.company ? { id: values.company.value } : undefined,
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


    return (
        <>
            <Modal width={900}
                keyboard={false}
                maskClosable={false}
                title="Add New User"
                open={openModal}
                onCancel={() => { setOpenModal(false); form.resetFields(); }}
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
                    </Row>
                </Form>

            </Modal >
        </>
    )

}


export default CreateUser