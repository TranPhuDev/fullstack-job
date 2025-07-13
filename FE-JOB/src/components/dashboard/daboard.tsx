import { Card, Col, Row, Statistic, Table, Typography, Spin, message } from "antd";
import { UserOutlined, ApartmentOutlined, FileTextOutlined, SolutionOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { callFetchUser, callFetchCompany, callFetchJob, callFetchResume } from '@/services/api';
import { Pie } from "@ant-design/plots";

const { Title } = Typography;

type RecentUser = Pick<IUser, 'id' | 'name' | 'email'> & { role: string };
type RecentJob = Pick<IJob, 'id' | 'name' | 'createdAt'> & { company: string };

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [userTotal, setUserTotal] = useState(0);
    const [companyTotal, setCompanyTotal] = useState(0);
    const [jobTotal, setJobTotal] = useState(0);
    const [resumeTotal, setResumeTotal] = useState(0);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch users
                const userRes = await callFetchUser('page=1&size=5&sort=createdAt,desc');
                setUserTotal(userRes?.data?.meta?.total || 0);
                setRecentUsers((userRes?.data?.result || []).map((u: IUser) => ({
                    id: u.id!,
                    name: u.name,
                    email: u.email,
                    role: u.role?.name || 'N/A',
                })));
                // Thống kê loại tài khoản
                const allUserRes = await callFetchUser('page=1&size=1000');
                const roleCount: Record<string, number> = {};
                (allUserRes?.data?.result || []).forEach((u: IUser) => {
                    const role = u.role?.name || 'Khác';
                    roleCount[role] = (roleCount[role] || 0) + 1;
                });
                // Thêm data mẫu cho dashboard sinh động

                // Fetch companies
                const companyRes = await callFetchCompany('page=1&size=1');
                setCompanyTotal(companyRes?.data?.meta?.total || 0);

                // Fetch jobs
                const jobRes = await callFetchJob('page=1&size=5&sort=createdAt,desc');
                setJobTotal(jobRes?.data?.meta?.total || 0);
                setRecentJobs((jobRes?.data?.result || []).map((j: IJob) => ({
                    id: j.id!,
                    name: j.name,
                    company: j.company?.name || 'N/A',
                    createdAt: j.createdAt ? new Date(j.createdAt).toLocaleDateString('vi-VN') : '',
                })));

                // Fetch resumes
                const resumeRes = await callFetchResume('page=1&size=1');
                setResumeTotal(resumeRes?.data?.meta?.total || 0);
            } catch {
                message.error('Lỗi khi tải dữ liệu dashboard!');
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // Data mẫu minh họa cho biểu đồ
    const donutData = [
        { type: 'Admin', value: 12 },
        { type: 'Nhà tuyển dụng', value: 30 },
        { type: 'Ứng viên', value: 45 },
        { type: 'Khách', value: 7 },
        { type: 'Super Admin', value: 2 },
        { type: 'Nhà phát triển', value: 4 },
    ];

    return (
        <div style={{ padding: 24, background: '#f4f6fa', minHeight: '100vh' }}>
            <Title level={2} style={{ marginBottom: 24, color: '#222' }}>Bảng điều khiển tổng quan</Title>
            {loading ? (
                <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />
            ) : (
                <>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12} md={6}>
                            <Card bordered={false} style={{ borderRadius: 12 }}>
                                <Statistic
                                    title="Tổng số người dùng"
                                    value={userTotal}
                                    prefix={<UserOutlined style={{ color: '#36cfc9' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card bordered={false} style={{ borderRadius: 12 }}>
                                <Statistic
                                    title="Tổng số công ty"
                                    value={companyTotal}
                                    prefix={<ApartmentOutlined style={{ color: '#9254de' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card bordered={false} style={{ borderRadius: 12 }}>
                                <Statistic
                                    title="Tổng số việc làm"
                                    value={jobTotal}
                                    prefix={<FileTextOutlined style={{ color: '#ff7875' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card bordered={false} style={{ borderRadius: 12 }}>
                                <Statistic
                                    title="Tổng số hồ sơ ứng tuyển"
                                    value={resumeTotal}
                                    prefix={<SolutionOutlined style={{ color: '#ffc53d' }} />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                        <Col xs={24} md={12}>
                            <Card bordered={false} style={{ borderRadius: 12, minHeight: 340 }}>
                                <Title level={4} style={{ marginBottom: 16 }}>Tỉ lệ loại tài khoản</Title>
                                <Pie
                                    data={donutData}
                                    angleField="value"
                                    colorField="type"
                                    radius={0.9}
                                    innerRadius={0.6}
                                    label={{
                                        type: 'outer',
                                        content: ({ type, value, percent }: { type: string; value: number; percent: number }) => `${type}: ${value} (${(percent * 100).toFixed(1)}%)`,
                                        style: { fontSize: 16, fontWeight: 600, fill: '#222' },
                                    }}
                                    legend={{ position: 'bottom', itemName: { style: { fontSize: 15 } } }}
                                    height={320}
                                    color={[ '#36cfc9', '#9254de', '#ff7875', '#ffc53d', '#73d13d', '#597ef7' ]}
                                    pieStyle={{
                                        lineWidth: 0,
                                        stroke: '#fff',
                                        shadowColor: 'rgba(0,0,0,0.08)',
                                        shadowBlur: 8,
                                        borderRadius: 8,
                                    }}
                                    statistic={{
                                        title: {
                                            content: 'Tổng',
                                            style: { fontSize: 18, color: '#222' },
                                        },
                                        content: {
                                            content: donutData.reduce((sum, d) => sum + d.value, 0).toString(),
                                            style: { fontSize: 24, fontWeight: 700, color: '#36cfc9' },
                                        },
                                    }}
                                    interactions={[{ type: 'element-active' }]}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card bordered={false} style={{ borderRadius: 12, minHeight: 340 }}>
                                <Title level={4} style={{ marginBottom: 16 }}>Người dùng mới</Title>
                                <Table
                                    dataSource={recentUsers.map(u => ({ ...u, key: u.id }))}
                                    columns={[
                                        { title: 'Tên', dataIndex: 'name', key: 'name' },
                                        { title: 'Email', dataIndex: 'email', key: 'email' },
                                        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
                                    ]}
                                    size="small"
                                    pagination={false}
                                    style={{ background: 'white', borderRadius: 8 }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                        <Col xs={24}>
                            <Card bordered={false} style={{ borderRadius: 12 }}>
                                <Title level={4} style={{ marginBottom: 16 }}>Việc làm mới đăng</Title>
                                <Table
                                    dataSource={recentJobs.map(j => ({ ...j, key: j.id }))}
                                    columns={[
                                        { title: 'Tên việc làm', dataIndex: 'name', key: 'name' },
                                        { title: 'Công ty', dataIndex: 'company', key: 'company' },
                                        { title: 'Ngày đăng', dataIndex: 'createdAt', key: 'createdAt' },
                                    ]}
                                    size="small"
                                    pagination={false}
                                    style={{ background: 'white', borderRadius: 8 }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default Dashboard;