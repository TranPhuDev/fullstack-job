import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentApp } from "../context/app.context";
import styles from './Header.module.scss';
import { logoutAPI, callFetchAllSkill, callFetchCompany } from 'services/api';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import logo from 'assets/images/EI.png';
import ManageAccount from '../client/manage.account';
import SubModal from '../client/modal.sub';
import LikeModal from '../client/modal.like';
import { FiMenu, FiX } from 'react-icons/fi';

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
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<number[]>([]); // Track expanded sections
    const [menuLeft, setMenuLeft] = useState([
        { label: 'Việc làm IT theo kỹ năng', data: [] },
        { label: 'Việc làm IT theo cấp bậc', data: levelData },
        { label: 'Việc làm IT theo công ty', data: [] },
        { label: 'Việc làm IT theo thành phố', data: cityData },
    ]);
    const navigate = useNavigate();
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);
    const [openSubModal, setOpenSubModal] = useState<boolean>(false);
    const [openLikeModal, setOpenLikeModal] = useState<boolean>(false);
    const { isAuthenticated, user, setUser, setIsAuthenticated, setFilter } = useCurrentApp();
    const topCompanyMenuLeft = [
        { label: 'Công ty IT tốt nhất' }
    ];
    const topCompanyMenuRight = [
        { label: 'Công ty IT tốt nhất 2025' }
    ];

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Thêm scroll detection để cải thiện sticky header
    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector(`.${styles.header}`);
            if (header) {
                if (window.scrollY > 10) {
                    header.classList.add(styles.scrolled);
                } else {
                    header.classList.remove(styles.scrolled);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Đóng mobile menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobile && isMobileMenuOpen) {
                const target = event.target as HTMLElement;
                if (!target.closest(`.${styles.mobileMenuOverlay}`) && !target.closest(`.${styles.hamburgerButton}`)) {
                    setIsMobileMenuOpen(false);
                    // Reset expanded sections khi đóng menu
                    setExpandedSections([]);
                }
            }
        };

        if (isMobile && isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobile, isMobileMenuOpen]);

    // Đóng mobile menu khi navigate
    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
            // Reset expanded sections khi đóng menu
            setExpandedSections([]);
        }
    }, [navigate]);

    // Đóng mobile menu khi resize từ mobile sang desktop
    useEffect(() => {
        if (!isMobile && isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
            // Reset expanded sections khi đóng menu
            setExpandedSections([]);
        }
    }, [isMobile, isMobileMenuOpen]);

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
    const handleFilterClick = (item: any, filterType?: string) => {
        // Nếu là thành phố thì item là object {label, value}
        const value = item?.value || item;

        // Nếu có filterType được truyền vào (từ mobile menu), sử dụng nó
        // Nếu không, sử dụng activeIndex (từ desktop menu)
        const type = filterType || (activeIndex === 0 ? 'skill' :
            activeIndex === 1 ? 'level' :
                activeIndex === 2 ? 'company' :
                    activeIndex === 3 ? 'city' : 'skill');

        setFilter(prev => ({
            ...prev,
            skill: type === 'skill' ? value : undefined,
            level: type === 'level' ? value : undefined,
            company: type === 'company' ? value : undefined,
            city: type === 'city' ? value : undefined,
        }));

        // Đóng mobile menu sau khi chọn filter
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }

        // Chuyển về trang home để xem kết quả filter
        navigate('/');
    };

    // Hàm toggle expanded section trong mobile menu
    const toggleExpandedSection = (sectionIndex: number) => {
        setExpandedSections(prev => {
            if (prev.includes(sectionIndex)) {
                return prev.filter(index => index !== sectionIndex);
            } else {
                return [...prev, sectionIndex];
            }
        });
    };

    return (
        <>
            <header className={styles.header + ' ' + styles.stickyHeader}>
                {/* Mobile Layout */}
                {isMobile ? (
                    <>
                        {/* Hamburger Menu Button */}
                        <div className={styles.mobileLeft}>
                            <button
                                className={styles.hamburgerButton}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                        </div>

                        {/* Logo ở giữa */}
                        <div className={styles.mobileCenter}>
                            <Link to="/" className={styles.logoLink}>
                                <img src={logo} alt="it job" className={styles.logo} />
                            </Link>
                        </div>

                        {/* Right side - User actions */}
                        <div className={styles.mobileRight}>
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
                                            <div className={styles.userMenuItem} onClick={() => setOpenLikeModal(true)}>Công việc yêu thích</div>
                                            <div className={styles.userMenuItem} onClick={() => setOpenSubModal(true)}>Nhận Jobs qua Email</div>
                                            <div className={styles.userMenuItem} onClick={handleLogout}>Đăng xuất</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <span
                                    className={styles.action}
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng Nhập
                                </span>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Desktop Layout - giữ nguyên */}
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
                                <li className={styles.menuItem} style={{ position: 'relative' }}>
                                    <span className={styles.menuLabel}>
                                        Top Công ty IT <span className={styles.arrow}>⌄</span>
                                    </span>
                                    <div className={styles.megaMenu} style={{ minWidth: 500 }}>
                                        <ul className={styles.megaMenuLeft}>
                                            {topCompanyMenuLeft.map((item) => (
                                                <li
                                                    key={item.label}
                                                    className={styles.active}
                                                    onMouseEnter={() => { }}
                                                >
                                                    {item.label}
                                                </li>
                                            ))}
                                        </ul>
                                        <div style={{ width: '100%', padding: 24 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                                {topCompanyMenuRight.map((item) => (
                                                    <span
                                                        key={item.label}
                                                        className={styles.skillsGrid}
                                                        style={{ display: 'flex', alignItems: 'center', padding: '6px 0 6px 12px', height: 36, color: '#ccc', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                        onClick={() => navigate('/company')}
                                                        onMouseOver={e => (e.currentTarget.style.background = '#353535', e.currentTarget.style.color = '#fff')}
                                                        onMouseOut={e => (e.currentTarget.style.background = '', e.currentTarget.style.color = '#ccc')}
                                                    >
                                                        {item.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
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
                                            <div className={styles.userMenuItem} onClick={() => setOpenLikeModal(true)}>Công việc yêu thích</div>
                                            <div className={styles.userMenuItem} onClick={() => setOpenSubModal(true)}>Nhận Jobs qua Email</div>
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
                        </div>
                    </>
                )}
            </header>

            {/* Mobile Menu Overlay */}
            {isMobile && isMobileMenuOpen && (
                <div className={styles.mobileMenuOverlay}>
                    <div className={styles.mobileMenuContent}>
                        <div className={styles.mobileMenuHeader}>
                            <h3>Menu</h3>
                            <button
                                className={styles.closeButton}
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    // Reset expanded sections khi đóng menu
                                    setExpandedSections([]);
                                }}
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className={styles.mobileMenuSection}>
                            <h4>Việc Làm IT</h4>
                            <ul className={styles.mobileMenuList}>
                                {menuLeft.map((item, idx) => (
                                    <li key={item.label}>
                                        <div className={styles.mobileMenuItem}>
                                            <span>{item.label}</span>
                                            {item.data && item.data.length > 0 ? (
                                                <div className={styles.mobileSubMenu}>
                                                    {/* Hiển thị tất cả options nếu section được expand, nếu không chỉ hiển thị 8 options đầu */}
                                                    {(expandedSections.includes(idx) ? item.data : item.data.slice(0, 8)).map((subItem: any) => (
                                                        <span
                                                            key={subItem.value || subItem.label || subItem}
                                                            onClick={() => {
                                                                // Truyền filterType tương ứng với index
                                                                const filterType = idx === 0 ? 'skill' :
                                                                    idx === 1 ? 'level' :
                                                                        idx === 2 ? 'company' :
                                                                            idx === 3 ? 'city' : 'skill';
                                                                handleFilterClick(subItem, filterType);
                                                            }}
                                                            className={styles.mobileSubMenuItem}
                                                        >
                                                            {subItem.label || subItem}
                                                        </span>
                                                    ))}
                                                    {/* Nút "Xem thêm" hoặc "Thu gọn" */}
                                                    {item.data.length > 8 && (
                                                        <span
                                                            className={`${styles.mobileSubMenuItem} ${styles.mobileExpandButton} ${expandedSections.includes(idx) ? styles.expanded : ''}`}
                                                            onClick={() => toggleExpandedSection(idx)}
                                                        >
                                                            {expandedSections.includes(idx) ? 'Thu gọn ↑' : `Xem thêm ${item.data.length - 8} tùy chọn ↓`}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className={styles.mobileSubMenu}>
                                                    <span className={styles.mobileSubMenuItem} style={{ color: '#999', fontStyle: 'italic' }}>
                                                        Đang tải...
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.mobileMenuSection}>
                            <h4>Top Công ty IT</h4>
                            <ul className={styles.mobileMenuList}>
                                <li>
                                    <div className={styles.mobileMenuItem}>
                                        <span>Công ty IT</span>
                                        <div className={styles.mobileSubMenu}>
                                            <span
                                                className={styles.mobileSubMenuItem}
                                                onClick={() => {
                                                    navigate('/company');
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Công ty tốt nhất 2025
                                            </span>

                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div >
            )}

            <ManageAccount
                open={openManageAccount}
                onClose={setOpenManageAccount}
            />
            <SubModal
                open={openSubModal}
                onClose={setOpenSubModal}
            />
            <LikeModal
                open={openLikeModal}
                onClose={setOpenLikeModal}
            />
        </>
    );
}

export default AppHeader




