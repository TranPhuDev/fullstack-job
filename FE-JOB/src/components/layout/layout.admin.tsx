import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    AppstoreOutlined,
    BankOutlined,
    ScheduleOutlined,
    AliwangwangOutlined,
    ApiOutlined,
    ExceptionOutlined,

} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, MenuProps, Result, Space, theme } from 'antd';
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from 'services/api';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import { ALL_PERMISSIONS } from '@/services/permissions';



const { Header, Sider, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];


// const items: MenuItem[] = [
//     {
//         key: '/admin',
//         icon: <AppstoreOutlined />,
//         label: <Link to="/admin">Dashboard</Link>,
//     },
//     {
//         key: '/admin/company',
//         icon: <BankOutlined />,
//         label: <Link to="/admin/company">Company</Link>,
//     },
//     {
//         key: '/admin/user',
//         icon: <UserOutlined />,
//         label: <Link to="/admin/user">User</Link>,
//     }
//     ,
//     {
//         key: '/admin/job',
//         icon: <ScheduleOutlined />,
//         label: <Link to="/admin/job">Job</Link>,
//     }
//     ,
//     {
//         key: '/admin/resume',
//         icon: <AliwangwangOutlined />,
//         label: <Link to="/admin/resume">Resume</Link>,
//     }
//     ,
//     {
//         key: '/admin/permission',
//         icon: <ApiOutlined />,
//         label: <Link to="/admin/permission">Permission</Link>,
//     }
//     ,
//     {
//         key: '/admin/role',
//         icon: <ExceptionOutlined />,
//         label: <Link to="/admin/role">Role</Link>,
//     }
// ];





const SideBarAdmin = () => {
    const { user, setUser, isAuthenticated, setIsAuthenticated } = useCurrentApp();

    const permissions = user?.role?.permissions || [];
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);


    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLogout = async () => {
        const res = await logoutAPI();
        // Kiểm tra statusCode để đảm bảo API call thành công
        if (res.data == null) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token")
        }
    }

    useEffect(() => {
        const ACL_ENABLE = import.meta.env.VITE_ACL_ENABLE;
        if (permissions?.length || ACL_ENABLE === 'false') {

            const viewCompany = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.method
            )

            const viewUser = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )

            const viewJob = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.JOBS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method
            )

            const viewResume = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.method
            )

            const viewRole = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
            )

            const viewPermission = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )

            const full = [
                {
                    label: <Link to='/admin'>Dashboard</Link>,
                    key: '/admin',
                    icon: <AppstoreOutlined />
                },
                ...(viewCompany || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/company'>Company</Link>,
                    key: '/admin/company',
                    icon: <BankOutlined />,
                }] : []),

                ...(viewUser || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/user'>User</Link>,
                    key: '/admin/user',
                    icon: <UserOutlined />
                }] : []),
                ...(viewJob || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/job'>Job</Link>,
                    key: '/admin/job',
                    icon: <ScheduleOutlined />
                }] : []),

                ...(viewResume || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/resume'>Resume</Link>,
                    key: '/admin/resume',
                    icon: <AliwangwangOutlined />
                }] : []),
                ...(viewPermission || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/permission'>Permission</Link>,
                    key: '/admin/permission',
                    icon: <ApiOutlined />
                }] : []),
                ...(viewRole || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/role'>Role</Link>,
                    key: '/admin/role',
                    icon: <ExceptionOutlined />
                }] : []),



            ];

            setMenuItems(full);
        }
    }, [permissions])
    useEffect(() => {
        setActiveMenu(location.pathname)
    }, [location])



    const dropdownItems: MenuProps['items'] = [
        {
            label: 'Quản lý tài khoản ',
            key: 'account',
        },
        {
            label: <Link style={{ textDecoration: "none" }} to="/">Trang chủ</Link>,
            key: 'homepage',
        }, {
            label: <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
                Đăng xuất
            </label>,
            key: 'logout',
        },
    ];

    // useEffect(() => {
    //     const active: any = items.find(
    //         (item) => location.pathname === (item!.key as any)) ?? "/admin";
    //     setActiveMenu(active?.key);
    // }, [location]);

    const isAdminRoute = location.pathname.includes("admin");
    const isAdmin = user?.role?.name; // Đổi "admin" thành tên role admin thực tế nếu khác

    // Nếu là route admin nhưng user không phải admin, render 403 full màn hình, ẩn sidebar
    if (isAuthenticated && isAdminRoute && !isAdmin) {
        return <Outlet />;
    }

    if (isAuthenticated === false) {
        return (
            <Outlet />
        )
    }

    const isValidAvatar = user?.avatar && user.avatar !== '-' && user.avatar !== 'null' && user.avatar.trim() !== '';

    return (<>

        <Layout>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <div style={{
                    color: '#ccc',
                    textAlign: 'center',
                    padding: '16px',
                    fontSize: '18px',
                }}>
                    Admin
                </div>
                <Menu theme="dark" selectedKeys={[activeMenu]} mode="inline" items={menuItems} onClick={(e) => setActiveMenu(e.key)} />
            </Sider>
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        {isAuthenticated ? <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                            <a style={{ textDecoration: "none" }} onClick={(e) => e.preventDefault()}>
                                <Space style={{ color: "rgb(151 151 151)", display: 'flex', alignItems: 'center' }}>
                                    <img
                                        src={isValidAvatar ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${user.avatar}` : defaultAvatar}
                                        alt="avatar"
                                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', marginRight: 8, border: '1px solid #eee', display: 'flex', alignItems: 'center' }}
                                    />
                                    <span style={{ fontWeight: 500, marginRight: 100 }}>{user?.name}</span>
                                </Space>
                            </a>
                        </Dropdown> : " "}


                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Phu Design ©{new Date().getFullYear()} Created by PHUDEV
                </Footer>
            </Layout>
        </Layout>
    </>
    );
}
export default SideBarAdmin;