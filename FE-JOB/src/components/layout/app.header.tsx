import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentApp } from "../context/app.context";
import styles from './Header.module.scss';
import { logoutAPI, callFetchAllSkill, callFetchCompany } from 'services/api';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import logo from 'assets/images/EI.png';

const levelData = [
    'Intern', 'Fresher', 'Junior', 'Middle', 'Senior'
];
const cityData = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'
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
    const { isAuthenticated, user, setUser, setIsAuthenticated } = useCurrentApp();

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

    return (
        <header className={styles.header + ' ' + styles.stickyHeader}>
            <div className={styles.left}>
                <img src={logo} alt="itviec logo" className={styles.logo} />
                {/* <span className={styles.brand}>viec</span> */}
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
                            <div className={styles.megaMenuRight}>
                                <div className={
                                    activeIndex === 2
                                        ? `${styles.skillsGrid} ${styles.companyGrid}`
                                        : activeIndex === 3
                                            ? `${styles.skillsGrid} ${styles.cityGrid}`
                                            : styles.skillsGrid
                                }>
                                    {menuLeft[activeIndex].data.map((skill: string) => (
                                        <span key={skill}>{skill}</span>
                                    ))}
                                </div>
                                <div className={
                                    activeIndex === 3 ? `${styles.seeAll} ${styles.cityLeft}` : styles.seeAll
                                }>
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
                                <div className={styles.userMenuItem}>Hồ Sơ</div>

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
    );
}

export default AppHeader




