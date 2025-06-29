import { loginAPI } from '@/services/api';
import { App, Button, Divider, Form, FormProps, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/auth.module.scss';

type FieldType = {
    username?: string;
    password?: string;
};
const LoginPage = () => {
    const navigate = useNavigate();
    const { notification, message } = App.useApp();

    const [isSubmit, setIsSubmit] = useState(false);


    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true)

        const res = await loginAPI(values)
        //success
        if (res.data) {
            // setIsAuthenticated(true)
            // setUser(res.data.user)
            const token = res.data.access_token;
            localStorage.setItem('access_token', token);
            message.success("Đăng nhập tài khoản thành công")
            // localStorage.setItem("isLoggedIn", "true");
            navigate('/')
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description:
                    "Email hoặc Password không chính xác!!",
                duration: 2

            })
        }

        setIsSubmit(false)


    };
    return (
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}>Đăng Nhập</h2>
                            <Divider />

                        </div>
                        <Form
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="username"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal">Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage