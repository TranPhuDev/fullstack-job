import { callUpdatePermission } from "@/services/api";
import { ALL_MODULES } from "@/services/permissions";
import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { App, Col, Form, Row } from "antd";


interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    dataInit?: IPermission | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}


const UpdatePermission = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, reloadTable, dataInit } = props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();

    const submitPermission = async (valuesForm: any) => {
        if (!dataInit || !dataInit.id) return;
        const permission = {
            name: valuesForm.name,
            apiPath: valuesForm.apiPath,
            method: valuesForm.method,
            module: valuesForm.module
        }
        const res = await callUpdatePermission(permission, dataInit.id as string);
        if (res.data) {
            message.success("Cập nhật permission thành công");
            handleReset();
            reloadTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setOpenModalUpdate(false);
    }

    return (
        <>
            <ModalForm
                title={<>{"Cập nhật Permission"}</>}
                open={openModalUpdate}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{"Cập nhật"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                initialValues={dataInit || {}}
                onFinish={submitPermission}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            name="name"
                            label="Tên Permission"
                            placeholder="Nhập tên permission"
                            rules={[{ required: true, message: 'Tên permission không được để trống' }]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            name="apiPath"
                            label="Đường dẫn API"
                            placeholder="Nhập đường dẫn API"
                            rules={[{ required: true, message: 'Đường dẫn API không được để trống' }]}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="method"
                            label="Phương thức"
                            options={[
                                { label: 'GET', value: 'GET' },
                                { label: 'POST', value: 'POST' },
                                { label: 'PUT', value: 'PUT' },
                                { label: 'DELETE', value: 'DELETE' }
                            ]}
                            rules={[{ required: true, message: 'Vui lòng chọn phương thức' }]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="module"
                            label="Module"
                            options={Object.keys(ALL_MODULES).map(key => ({ label: key, value: key }))}
                            rules={[{ required: true, message: 'Vui lòng chọn module' }]}
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default UpdatePermission;