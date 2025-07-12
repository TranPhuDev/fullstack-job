import { callCreatePermission } from "@/services/api";
import { ALL_MODULES } from "@/services/permissions";
import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { App, Col, Form, Row } from "antd";


interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    reloadTable: () => void;
}

const CreatePermission = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, reloadTable } = props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();

    const submitPermission = async (valuesForm: any) => {
        const permission = {
            name: valuesForm.name,
            apiPath: valuesForm.apiPath,
            method: valuesForm.method,
            module: valuesForm.module
        }
        const res = await callCreatePermission(permission);
        if (res.data) {
            message.success("Thêm mới permission thành công");
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
        setOpenModalCreate(false);
    }
    return (
        <>
            <ModalForm
                title={<>{"Tạo mới Permission"}</>}
                open={openModalCreate}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{"Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitPermission}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên Permission"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập name"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="API Path"
                            name="apiPath"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập path"
                        />
                    </Col>

                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="method"
                            label="Method"
                            valueEnum={{
                                GET: 'GET',
                                POST: 'POST',
                                PUT: 'PUT',
                                PATCH: 'PATCH',
                                DELETE: 'DELETE',
                            }}
                            placeholder="Please select a method"
                            rules={[{ required: true, message: 'Vui lòng chọn method!' }]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="module"
                            label="Thuộc Module"
                            valueEnum={ALL_MODULES}
                            placeholder="Please select a module"
                            rules={[{ required: true, message: 'Vui lòng chọn module!' }]}
                        />
                    </Col>

                </Row>
            </ModalForm>
        </>
    )
}

export default CreatePermission;