import React, { useEffect, useState } from "react";
import styles from "styles/featured.employer.module.scss";
import { FiMapPin, FiArrowRightCircle } from "react-icons/fi";
import { callFetchCompanyWithJobs } from '@/services/api';
import { Link } from "react-router-dom";

const FeaturedEmployer = () => {
  const [company, setCompany] = useState<ICompanyWithJobs | null>(null);
  const [randomJobs, setRandomJobs] = useState<{ title: string; id: string }[]>([]);

  
  useEffect(() => {
    const fetchData = async () => {
      const res = await callFetchCompanyWithJobs();
      if (res && res.data && res.data.length > 0) {
        // Lọc các công ty có jobCount > 3
        const companiesWithJobs = res.data.filter((c: ICompanyWithJobs) => c.jobCount >= 3);
        if (companiesWithJobs.length > 0) {
          // Random một công ty
          const randomIdx = Math.floor(Math.random() * companiesWithJobs.length);
          const selectedCompany = companiesWithJobs[randomIdx];
          setCompany(selectedCompany);
          // Random 3 job từ jobNames/jobIds
          const jobs = selectedCompany.jobNames.map((title: string, idx: number) => ({ title, id: String(selectedCompany.jobIds[idx]) }));
          const shuffled = jobs.sort(() => 0.5 - Math.random());
          setRandomJobs(shuffled.slice(0, 3));
        }
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
          src={
            company.name.toLowerCase().includes("apple")
              ? "https://res.cloudinary.com/djmkp6zls/image/upload/v1752404437/apple_engg2a.jpg"
              : company.name.toLowerCase().includes("aws")
              ? "https://res.cloudinary.com/djmkp6zls/image/upload/v1751954965/aws_o7fkhl.jpg"
              : company.name.toLowerCase().includes("google")
              ? "https://res.cloudinary.com/djmkp6zls/image/upload/v1752404716/google_bo1ack.jpg"
              : "https://res.cloudinary.com/djmkp6zls/image/upload/v1751954965/aws_o7fkhl.jpg"
          }
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
        {randomJobs.map((job, idx) => (
          <div key={idx} className={styles.jobItem}>
            <FiArrowRightCircle className={styles.jobIcon} />
            <Link to={`/job/${job.id}`} className={styles.jobLinkToDetail}>{job.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedEmployer;