import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentApp } from "../context/app.context";
import styles from './Header.module.scss';
import { logoutAPI, callFetchAllSkill, callFetchCompany } from 'services/api';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import logo from 'assets/images/EI.png';
import ManageAccount from '../client/manage.account';

const levelData = [
    'Intern', 'Fresher', 'Junior', 'Middle', 'Senior'
];
const cityData = [
    { label: 'Hà Nội', value: 'HANOI' },
    { label: 'Hồ Chí Minh', value: 'HOCHIMINH' },
    { label: 'Đà Nẵng', value: 'DANANG' }
];

const AppHeader = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [menuLeft, setMenuLeft] = useState([
        { label: 'Việc làm IT theo kỹ năng', data: [] },
        { label: 'Việc làm IT theo cấp bậc', data: levelData },
        { label: 'Việc làm IT theo công ty', data: [] },
        { label: 'Việc làm IT theo thành phố', data: cityData },
    ]);
    const navigate = useNavigate();
    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);
    const { isAuthenticated, user, setUser, setIsAuthenticated, setFilter } = useCurrentApp();

    useEffect(() => {
        // Fetch skills
        callFetchAllSkill('page=1&pageSize=100').then(res => {
            const resultArr = res.data && Array.isArray((res.data as unknown as { result?: { name?: string }[] }).result)
                ? (res.data as unknown as { result: { name?: string }[] }).result
                : [];
            const skills: string[] = resultArr.map((item) => item.name || '');
            setMenuLeft(prev => {
                const newMenu = [...prev];
                newMenu[0] = { ...newMenu[0], data: skills };
                return newMenu;
            });
        });
        // Fetch companies
        callFetchCompany('page=1&pageSize=100').then(res => {
            const resultArr = res.data && Array.isArray((res.data as unknown as { result?: { name?: string }[] }).result)
                ? (res.data as unknown as { result: { name?: string }[] }).result
                : [];
            const companies: string[] = resultArr.map((item) => item.name || '');
            setMenuLeft(prev => {
                const newMenu = [...prev];
                newMenu[2] = { ...newMenu[2], data: companies };
                return newMenu;
            });
        });
    }, []);

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data == null) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
        }
    };

    // Hàm set filter khi click vào item
    const handleFilterClick = (item: any) => {
        // Nếu là thành phố thì item là object {label, value}
        const value = item?.value || item;
        setFilter(prev => ({
            ...prev,
            skill: activeIndex === 0 ? value : undefined,
            level: activeIndex === 1 ? value : undefined,
            company: activeIndex === 2 ? value : undefined,
            city: activeIndex === 3 ? value : undefined,
        }));
    };

    return (
        <>
            <header className={styles.header + ' ' + styles.stickyHeader}>
                <div className={styles.left}>
                    <Link to="/" className={styles.logoLink}>
                        <img src={logo} alt="it job" className={styles.logo} />
                    </Link>
                    <ul className={styles.menu}>
                        <li className={styles.menuItem}>
                            <span className={styles.menuLabel}>
                                Việc Làm IT <span className={styles.arrow}>⌄</span>
                            </span>
                            <div className={styles.megaMenu}>
                                <ul className={styles.megaMenuLeft}>
                                    {menuLeft.map((item, idx) => (
                                        <li
                                            key={item.label}
                                            className={idx === activeIndex ? styles.active : ''}
                                            onMouseEnter={() => setActiveIndex(idx)}
                                        >
                                            {item.label}
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ width: '100%' }}>
                                    <div className={
                                        activeIndex === 1
                                            ? `${styles.skillsGrid} ${styles.levelGrid}`
                                            : activeIndex === 2
                                                ? `${styles.skillsGrid} ${styles.companyGrid}`
                                                : activeIndex === 3
                                                    ? `${styles.skillsGrid} ${styles.cityGrid}`
                                                    : styles.skillsGrid
                                    }>
                                        {menuLeft[activeIndex].data.map((item: any) => (
                                            <span
                                                key={item.value || item.label || item}
                                                onClick={() => handleFilterClick(item)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {item.label || item}
                                            </span>
                                        ))}
                                    </div>
                                    <div className={styles.seeAll}>
                                        {activeIndex === 3 ? 'Thành phố khác' : 'Xem tất cả'}
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className={styles.menuItem}>
                            <span className={styles.menuLabel}>
                                Top Công ty IT <span className={styles.arrow}>⌄</span>
                            </span>
                        </li>
                        <li className={styles.menuItem}>
                            <span className={styles.menuLabel}>
                                Blog <span className={styles.arrow}>⌄</span>
                            </span>
                        </li>
                    </ul>
                </div>
                <div className={styles.right}>
                    {isAuthenticated ? (
                        <div className={styles.avatarBox}>
                            <img
                                src={user?.avatar ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${user.avatar}` : defaultAvatar}
                                alt="avatar"
                                className={styles.avatar}
                                tabIndex={0}
                            />
                            <div className={styles.userCard}>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatarLarge}>
                                        {user?.avatar
                                            ? <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${user.avatar}`} alt="avatar" />
                                            : <span>{user?.name?.[0] || "U"}</span>
                                        }
                                    </div>
                                    <div>
                                        <div className={styles.userName}>{user?.name || "User"}</div>
                                        <div className={styles.userEmail}>{user?.email}</div>
                                    </div>
                                </div>
                                <div className={styles.userMenu}>
                                    {user?.role?.name != null && (
                                        <div
                                            className={styles.userMenuItem}
                                            onClick={() => navigate('/admin')}
                                        >
                                            Trang quản trị
                                        </div>
                                    )}
                                    <div className={styles.userMenuItem} onClick={() => setOpenManageAccount(true)}>Hồ Sơ</div>
                                    <div className={styles.userMenuItem}>Nhận Jobs qua Email</div>
                                    <div className={styles.userMenuItem} onClick={handleLogout}>Đăng xuất</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <span
                            className={styles.action}
                            onClick={() => navigate('/login')}
                        >
                            Đăng Nhập/Đăng Ký
                        </span>
                    )}
                    <span className={styles.lang}>EN</span>
                    <span className={styles.divider}>|</span>
                    <span className={styles.lang}>VI</span>
                </div>
            </header>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    );

}

export default AppHeader




