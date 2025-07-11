import React, { useEffect, useState } from "react";
import styles from "styles/featured.employer.module.scss";
import { FiMapPin, FiArrowRightCircle } from "react-icons/fi";
import { callFetchCompanyWithJobs } from '@/services/api';
import { Link } from "react-router-dom";

const FeaturedEmployer = () => {
  const [company, setCompany] = useState<ICompanyWithJobs | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await callFetchCompanyWithJobs();
      if (res && res.data && res.data.length > 0) {
        setCompany(res.data[0]);
      }
    };
    fetchData();
  }, []);

  if (!company) return null;

  return (
    <div className={`${styles.featuredEmployerWrapper}`}>
      {/* Banner + label */}
      <div className={styles.bannerSection}>
        <img
          src="https://res.cloudinary.com/djmkp6zls/image/upload/v1751954965/aws_o7fkhl.jpg"
          alt="Banner"
          className={styles.bannerImage}
        />
        <div className={styles.featuredLabel}>Nhà Tuyển Dụng Nổi Bật</div>
        <img
          src={company.logo ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${company.logo}` : "https://via.placeholder.com/150"}
          alt={company.name}
          className={styles.companyLogo}
        />
      </div>
      {/* Info */}
      <div className={styles.infoSection}>
        <div className={styles.companyName}>{company.name}</div>
        <div className={styles.companyLocation}>
          <FiMapPin style={{ marginRight: 4 }} />
          {company.address}
        </div>
        {(() => {
          let firstSentence = '';
          if (company.description) {
            // Loại bỏ thẻ HTML để lấy câu đầu tiên
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = company.description;
            const text = tempDiv.textContent || tempDiv.innerText || '';
            const match = text.match(/^[^.!?\n]+[.!?]/);
            if (match) {
              firstSentence = match[0];
            } else {
              firstSentence = text.split(/[.!?\n]/)[0];
            }
          }
          return <div className={styles.companyDesc}>{firstSentence}</div>;
        })()}
        <Link to={`/?company=${encodeURIComponent(company.name)}`} className={styles.jobsLink}>
          Xem {company.jobCount} việc làm &nbsp; <FiArrowRightCircle />
        </Link>
      </div>
      {/* Jobs */}
      <div className={styles.jobsSection}>
        {company.jobNames.map((title, idx) => (
          <div key={idx} className={styles.jobItem}>
            <FiArrowRightCircle className={styles.jobIcon} />
            <Link to={`/job/${company.jobIds[idx]}`} className={styles.jobLinkToDetail}>{title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedEmployer;