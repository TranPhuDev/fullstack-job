import { ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { App, Col, Form, Modal, Row } from "antd";
import { FormProps } from "antd";
import { useState, useEffect } from "react";
import { DebounceSelect } from "./debounce.select";
import { callFetchCompany, callFetchRole, callUpdateUser } from "@/services/api";


interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IUser | null;
    setDataUpdate: (v: IUser | null) => void;
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

const UpdateUser = (props: IProps) => {


    const { openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdate, setDataUpdate } = props;

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { message, notification } = App.useApp();

    const [companies, setCompanies] = useState<ICompanySelect[]>([]);

    const [roles, setRoles] = useState<ICompanySelect[]>([]);



    //gui form
    const [form] = Form.useForm();

    // Đổ dữ liệu vào form khi mở modal cập nhật
    useEffect(() => {
        if (dataUpdate) {
            const roleValue = dataUpdate.role
                ? { label: dataUpdate.role.name, value: dataUpdate.role.id }
                : undefined;
            const companyValue = dataUpdate.company
                ? { label: dataUpdate.company.name, value: dataUpdate.company.id }
                : undefined;
            form.setFieldsValue({
                ...dataUpdate,
                role: roleValue,
                company: companyValue,
                password: dataUpdate.password
            });
            setRoles(roleValue ? [roleValue] : []);
            setCompanies(companyValue ? [companyValue] : []);
        } else {
            setRoles([]);
            setCompanies([]);
            form.resetFields();
        }
    }, [dataUpdate]);

    const handleCancel = () => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
        form.resetFields();
        setRoles([]);
        setCompanies([]);
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true)
        const formRole = form.getFieldValue('role');
        const formCompany = form.getFieldValue('company');
        const payload = {
            ...values,
            id: dataUpdate?.id,
            role: formRole ? { id: formRole.value || formRole } : undefined,
            company: formCompany ? { id: formCompany.value || formCompany } : undefined,
        };
        const res = await callUpdateUser(payload);
        if (res && res.data) {
            message.success("Cập nhật user thành công")
            form.resetFields();
            setRoles([]);
            setCompanies([]);
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({ message: "Đã có lỗi xảy ra", description: res.message })
        }
        setIsSubmit(false)
    };

    const fetchCompanyList = async (name: string): Promise<ICompanySelect[]> => {
        const res = await callFetchCompany(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            return res.data.result.map((item: { id?: string; name?: string }) => ({
                label: String(item.name ?? ''),
                value: String(item.id ?? '')
            }));
        }
        return [];
    };

    const fetchRoleList = async (name: string): Promise<ICompanySelect[]> => {
        const res = await callFetchRole(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            return res.data.result.map((item: { id?: string; name?: string }) => ({
                label: String(item.name ?? ''),
                value: String(item.id ?? '')
            }));
        }
        return [];
    };

    return (
        <>
            <Modal width={900}
                keyboard={false}
                maskClosable={false}
                title="Cập nhật User"
                open={openModalUpdate}
                onCancel={handleCancel}
                onOk={() => { form.submit() }}
                confirmLoading={isSubmit}
                okText={"Cập nhật"}
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
                                disabled={true}
                                label="Password"
                                name="password"
                                rules={[{ required: false, message: 'Vui lòng không bỏ trống' }]}
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
                                rules={[{ required: false, message: 'Vui lòng chọn vai trò!' }]}

                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    placeholder="Chọn công vai trò"
                                    value={form.getFieldValue('role')}
                                    fetchOptions={fetchRoleList}
                                    onChange={(newValue: ICompanySelect | ICompanySelect[] | undefined) => {
                                        if (Array.isArray(newValue)) {
                                            setRoles(newValue);
                                            form.setFieldValue('role', newValue.length > 0 ? newValue[0] : undefined);
                                        } else if (!newValue) {
                                            setRoles([]);
                                            form.setFieldValue('role', undefined);
                                        } else {
                                            setRoles([newValue]);
                                            form.setFieldValue('role', newValue);
                                        }
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>

                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProForm.Item
                                name="company"
                                label="Thuộc Công Ty"
                                rules={[{ required: false, message: 'Vui lòng chọn company!' }]}
                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    value={form.getFieldValue('company')}
                                    placeholder="Chọn công ty"
                                    fetchOptions={fetchCompanyList}
                                    onChange={(newValue: ICompanySelect | ICompanySelect[] | undefined) => {
                                        if (Array.isArray(newValue)) {
                                            setCompanies(newValue);
                                            form.setFieldValue('company', newValue.length > 0 ? newValue[0] : undefined);
                                        } else if (!newValue) {
                                            setCompanies([]);
                                            form.setFieldValue('company', undefined);
                                        } else {
                                            setCompanies([newValue]);
                                            form.setFieldValue('company', newValue);
                                        }
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

export default UpdateUser