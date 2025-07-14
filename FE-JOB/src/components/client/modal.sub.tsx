import { App, Button, Col, Form, Modal, Row, Select, Tabs, TabsProps } from "antd";
import { useCurrentApp } from "../context/app.context";
import { useEffect, useState } from "react";
import { callCreateSubscriber, callFetchAllSkill, callGetSubscriberSkills, callUpdateSubscriber, callSendMailToCurrentUser, callUnsubscribeSubscriber, callResubscribeSubscriber } from "@/services/api";
import axios from "axios";
import { MonitorOutlined } from "@ant-design/icons";


interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}



const JobByEmail = (props: any) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const { user } = useCurrentApp();
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);

    useEffect(() => {
        const init = async () => {
            await fetchSkill();
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                setSubscriber(res.data);
                const d = res.data.skills;
                // Chỉ set mảng id cho form
                const arr = d.map((item: any) => item.id + "");
                form.setFieldValue("skills", arr);
            }
        }
        init();
    }, [])

    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr = res?.data?.result?.map(item => {
                return {
                    label: item.name as string,
                    value: item.id + "" as string
                }
            }) ?? [];
            setOptionsSkills(arr);
        }
    }

    // Hàm gửi mail và hiện notification
    const sendMailAndNotify = async () => {
        const mailRes = await callSendMailToCurrentUser();
        if (mailRes && mailRes.data) {
            setTimeout(() => {
                notification.success({ message: 'Vui lòng kiểm tra gmail' });
            }, 4000);
        } else {
            notification.error({
                message: 'Gửi mail thất bại, email đăng kí không tồn tại!',
                description: mailRes?.message || 'Có lỗi khi gửi mail.'
            });
        }
    };

    const onFinish = async (values: any) => {
        const { skills } = values;
        const arr = skills?.map((item: any) => ({ id: typeof item === "object" && item.id ? item.id : item }));

        // 1. Chưa từng đăng ký
        if (!subscriber?.id) {
            const data = {
                email: user?.email,
                name: user?.name,
                skills: arr
            };
            const res = await callCreateSubscriber(data);
            if (res.data) {
                message.success("Đăng ký thành công");
                setSubscriber(res.data);
                await sendMailAndNotify();
            } else {
                notification.error({ message: 'Có lỗi xảy ra', description: res.message });
            }
            return;
        }

        // 2. Đã đăng ký nhưng đã hủy nhận mail => Đăng ký lại + cập nhật skill
        if (subscriber.receiveEmail === false) {
            // Đăng ký lại
            const resub = await callResubscribeSubscriber();
            if (resub && resub.data) {
                // Cập nhật skill sau khi đăng ký lại
                const res = await callUpdateSubscriber({ id: subscriber.id, skills: arr });
                if (res.data) {
                    message.success("Đăng ký và cập nhật kỹ năng thành công");
                    setSubscriber({ ...res.data, receiveEmail: true });
                    await sendMailAndNotify();
                } else {
                    notification.error({ message: 'Cập nhật kỹ năng thất bại', description: res.message });
                }
            } else {
                notification.error({ message: "Đăng ký thất bại!" });
            }
            return;
        }

        // 3. Đã đăng ký và đang nhận mail (cập nhật skill)
        const res = await callUpdateSubscriber({ id: subscriber.id, skills: arr });
        if (res.data) {
            message.success("Cập nhật thông tin thành công");
            setSubscriber(res.data);
            await sendMailAndNotify();
        } else {
            notification.error({ message: 'Có lỗi xảy ra', description: res.message });
        }
    };

    const handleUnsubscribe = async () => {
        if (!user?.email) return;
        try {
            const res = await callUnsubscribeSubscriber(user.email);
            if (res && res.data) {
                notification.success({ message: "Đã hủy đăng ký nhận mail thành công!" });
                setSubscriber({ ...subscriber, receiveEmail: false } as any);
            } else {
                notification.error({ message: "Hủy đăng ký thất bại!" });
            }
        } catch (e) {
            notification.error({ message: "Hủy đăng ký thất bại!" });
        }
    };


    return (
        <>
            <Form
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={"Kỹ năng"}
                            name={"skills"}
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}

                        >
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> Tìm theo kỹ năng...
                                    </>
                                }
                                optionLabelProp="label"
                                options={optionsSkills}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button onClick={() => form.submit()}>Đăng ký</Button>
                        {subscriber?.receiveEmail !== false && (
                            <Button danger style={{ marginLeft: 12 }} onClick={handleUnsubscribe}>
                                Hủy đăng ký
                            </Button>
                        )}
                    </Col>
                </Row>
            </Form>
        </>
    )


};

const SubModal = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [

        {
            key: 'email-by-skills',
            label: `Nhận Jobs qua Email`,
            children: <JobByEmail />,
        },

    ];


    return (
        <>
            <Modal
                title="Đăng ký nhận thông báo"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width="1000px"
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="email-by-skills"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )

}
export default SubModal;