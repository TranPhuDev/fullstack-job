import React from "react";
import styles from "styles/featured.employer.module.scss";
import { FiMapPin, FiArrowRightCircle } from "react-icons/fi";
import logoFsoft from "assets/images/fsoft.webp"
import { Link } from "react-router-dom";
const jobs = [
  { title: "Senior Embedded Software Engineer - Salary up to $3000" },
  { title: "Senior Android Software Engineer (Kotlin) - Up to $3000" },
  { title: "Senior C++ Software Engineer - Salary up to $3000" },
];

const FeaturedEmployer = () => {
  return (
    <div className={styles.featuredEmployerWrapper}>
      {/* Banner + label */}
      <div className={styles.bannerSection}>
        <img
          src="https://res.cloudinary.com/djmkp6zls/image/upload/meeting_iyhqyb"
          alt="FPT Software Banner"
          className={styles.bannerImage}
        />
        <div className={styles.featuredLabel}>Nhà Tuyển Dụng Nổi Bật</div>
        <img
          src={logoFsoft}
          alt="FPT Software Logo"
          className={styles.companyLogo}
        />
      </div>
      {/* Info */}
      <div className={styles.infoSection}>
        <div className={styles.companyName}>FPT Software</div>
        <div className={styles.companyLocation}>
          <FiMapPin style={{ marginRight: 4 }} />
          TP Hồ Chí Minh - Hà Nội - Đà Nẵng - Khác
        </div>
        <div className={styles.companyDesc}>
          The leading provider of software outsourcing services in Vietnam
        </div>
        <Link to="#" className={styles.jobsLink}>
          Xem 3 việc làm &nbsp; <FiArrowRightCircle />
        </Link>
      </div>
      {/* Jobs */}
      <div className={styles.jobsSection}>
        {jobs.map((job, idx) => (
          <div key={idx} className={styles.jobItem}>
            <FiArrowRightCircle className={styles.jobIcon} />
            <span>{job.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedEmployer;