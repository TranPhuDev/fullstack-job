import React from "react";
import styles from "./Footer.module.scss";
import logo from 'src/assets/images/EI.png';

const AppFooter = () => {
    return (
        <footer className={styles["app-footer"]}>
            <div className={styles["footer-container"]}>
                <div className={styles["footer-col"] + ' ' + styles["logo-col"]}>
                    <div className={styles["footer-logo"]}>
                        <img src={logo} alt="IT job logo" className={styles["footer-logo-img"]} />
                    </div>
                    <div className={styles["footer-slogan"]}>Ít nhưng mà chất</div>
                    <div className={styles["footer-social"]}>
                        <a href="https://www.instagram.com/tr_uhp/" target="_blank" aria-label="LinkedIn" className={styles["footer-social-icon"]}>
                            {/* LinkedIn SVG */}
                            <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#19191A" /><path d="M10.5 11.5h2v1.09c.28-.53 1.02-1.09 2.1-1.09 2.24 0 2.65 1.47 2.65 3.38v4.12h-2.1v-3.65c0-.87-.02-2-1.22-2-1.23 0-1.42.96-1.42 1.94v3.71h-2.1V11.5zm-3.5 0h2.1v7.5h-2.1v-7.5zm1.05-3.5c.67 0 1.22.55 1.22 1.22 0 .67-.55 1.22-1.22 1.22-.67 0-1.22-.55-1.22-1.22 0-.67.55-1.22 1.22-1.22z" fill="#fff" /></svg>
                        </a>
                        <a href="https://www.facebook.com/phu.tran.244255" target="_blank" aria-label="Facebook" className={styles["footer-social-icon"]}>
                            {/* Facebook SVG */}
                            <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#19191A" /><path d="M15.5 11.5V10.5c0-.41.34-.75.75-.75h1.25V8h-2c-1.1 0-2 .9-2 2v1.5H11v2h2v5h2.5v-5h1.5l.5-2h-2z" fill="#fff" /></svg>
                        </a>
                        <a href="#" aria-label="YouTube" className={styles["footer-social-icon"]}>
                            {/* YouTube SVG */}
                            <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#19191A" /><path d="M19.5 12.5c0-.83-.67-1.5-1.5-1.5h-6c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h6c.83 0 1.5-.67 1.5-1.5v-3zm-6.5 3.5v-3l3 1.5-3 1.5z" fill="#fff" /></svg>
                        </a>
                    </div>
                </div>
                <div className={styles["footer-col"]}>
                    <div className={styles["footer-title"]}>Về ITJob</div>
                    <ul>
                        <li><a href="#">Trang Chủ</a></li>
                        <li><a href="#">Liên Hệ</a></li>
                    </ul>
                </div>
                <div className={styles["footer-col"]}>
                    <div className={styles["footer-title"]}>Chương trình</div>
                    <ul>
                        <li><a href="#">Chuyện IT</a></li>
                        <li><a href="#">Cuộc thi viết</a></li>
                        <li><a href="#">Việc làm IT nổi bật</a></li>
                        <li><a href="#">Khảo sát thường niên</a></li>
                    </ul>
                </div>
                <div className={styles["footer-col"]}>
                    <div className={styles["footer-title"]}>Điều khoản chung</div>
                    <ul>
                        <li><a href="#">Quy định bảo mật</a></li>
                        <li><a href="#">Quy chế hoạt động</a></li>
                        <li><a href="#">Giải quyết khiếu nại</a></li>
                        <li><a href="#">Thỏa thuận sử dụng</a></li>
                        <li><a href="#">Thông cáo báo chí</a></li>
                    </ul>
                </div>
                <div className={styles["footer-col"] + ' ' + styles["contact-col"]}>
                    <div className={styles["footer-title"]}>Liên hệ để đăng tin tuyển dụng tại:</div>
                    <ul className={styles["footer-contact-list"]}>
                        <li><span className={styles["footer-contact-icon"]}>📞</span> Số điẹn thoại: (+84) 774 530 086</li>
                        <li><span className={styles["footer-contact-icon"]}>✉️</span> Email: <a href="mailto:tranphudev3110@gmail.com">tranphudev3110@gmail.com</a></li>
                        <li><span className={styles["footer-contact-icon"]}>📩</span> Gửi thông tin liên hệ</li>
                    </ul>
                </div>
            </div>
            <div className={styles["footer-bottom"]}>
                <span>Copyright © IT JOB</span>
                <span>|</span>
                <span>MST: 0774530086</span>
            </div>
        </footer>
    );
};

export default AppFooter;
