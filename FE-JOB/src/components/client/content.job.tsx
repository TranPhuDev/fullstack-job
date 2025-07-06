import React, { useState } from "react";
import { FiMapPin, FiClock, FiBriefcase } from "react-icons/fi";
import styles from "../../styles/content.job.module.scss";

// Mock data cho danh sách job
const mockJobs = [
  {
    id: 1,
    title: "ReactJS Frontend Developer (JavaScript, TypeScript)",
    company: "Goline Corporation",
    location: "Hà Nội",
    tags: ["JavaScript", "Bootstrap", "CSS", "HTML", "ReactJS", "TypeScript"],
    attractive: true,
    description: "Làm việc với các công nghệ mới nhất. Lĩnh vực chứng khoán, tài chính hấp dẫn. Liên tục được đào tạo chuyên môn, kĩ năng.",
    detail: `- Làm việc với các công nghệ mới nhất\n- Lĩnh vực chứng khoán, tài chính hấp dẫn\n- Liên tục được đào tạo chuyên môn, kĩ năng`,
  },
  {
    id: 2,
    title: "Cloud DevOps Lead - AWS",
    company: "TymeX",
    location: "TP Hồ Chí Minh",
    tags: ["AWS", "AWS Lambda", "Kafka", "Java", "Microservices"],
    attractive: true,
    description: "You'll love it",
    detail: `- Quản lý hệ thống cloud\n- Lãnh đạo team DevOps\n- Làm việc với AWS Lambda, Kafka, Java, Microservices`,
  },
  {
    id: 3,
    title: "Information Security Engineer (Networking, System, Risk)",
    company: "ABC Corp",
    location: "Hà Nội",
    tags: ["Security", "Networking", "System", "Risk"],
    attractive: true,
    description: "Cơ hội phát triển chuyên sâu về bảo mật",
    detail: `- Đánh giá rủi ro hệ thống\n- Triển khai giải pháp bảo mật\n- Làm việc với các hệ thống lớn`,
  },
  {
    id: 4,
    title: "Information Security Engineer (Networking, System, Risk)",
    company: "ABC Corp",
    location: "Hà Nội",
    tags: ["Security", "Networking", "System", "Risk"],
    attractive: true,
    description: "Cơ hội phát triển chuyên sâu về bảo mật",
    detail: `- Đánh giá rủi ro hệ thống\n- Triển khai giải pháp bảo mật\n- Làm việc với các hệ thống lớn`,
  },
  {
    id: 5,
    title: "Information Security Engineer (Networking, System, Risk)",
    company: "ABC Corp",
    location: "Hà Nội",
    tags: ["Security", "Networking", "System", "Risk"],
    attractive: true,
    description: "Cơ hội phát triển chuyên sâu về bảo mật",
    detail: `- Đánh giá rủi ro hệ thống\n- Triển khai giải pháp bảo mật\n- Làm việc với các hệ thống lớn`,
  },
  {
    id: 6,
    title: "Information Security Engineer (Networking, System, Risk)",
    company: "ABC Corp",
    location: "Hà Nội",
    tags: ["Security", "Networking", "System", "Risk"],
    attractive: true,
    description: "Cơ hội phát triển chuyên sâu về bảo mật",
    detail: `- Đánh giá rủi ro hệ thống\n- Triển khai giải pháp bảo mật\n- Làm việc với các hệ thống lớn`,
  },

];

const ContentJob = () => {
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);
  const [favoriteJobs, setFavoriteJobs] = useState<number[]>([]);

  const isFavorite = favoriteJobs.includes(selectedJob.id);
  const handleToggleFavorite = () => {
    setFavoriteJobs((prev) =>
      isFavorite ? prev.filter((id) => id !== selectedJob.id) : [...prev, selectedJob.id]
    );
  };

  return (
    <div className="container mt-3">
      <div className="row">
        {/* Danh sách job bên trái */}
        <div className="col-5 ">
          <div className={styles.jobListWrapper}>
            {mockJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={
                  job.id === selectedJob.id
                    ? `${styles.jobItem} ${styles.selected}`
                    : styles.jobItem
                }
              >
                <div className={styles.jobTitle}>{job.title}</div>
                <div className={styles.jobListCompanyRow}>
                  <div className={styles.companyLogo} style={{ width: 40, height: 40, fontSize: '1.2rem' }}>
                    {job.company?.[0] || "?"}
                  </div>
                  <div className={styles.jobCompany}>{job.company} - {job.location}</div>
                </div>
                <div className={styles.tagList}>
                  {job.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <div className={job.attractive ? styles.attractive : styles.normalDesc}>
                  {job.attractive ? <span style={{ marginRight: 4 }}>💲</span> : null}
                  {job.attractive ? "Very attractive!!!" : job.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chi tiết job bên phải */}
        <div className="col-7">
          <div className={styles.detailWrapper}>
            <div className={styles.detailHeaderRow}>
              <div className={styles.companyLogo}>
                {selectedJob.company?.[0] || "?"}
              </div>
              <div className={styles.detailInfoBlock}>
                <h2 className={styles.detailTitle}>{selectedJob.title}</h2>
                <div className={styles.detailCompany}>{selectedJob.company}</div>
                <div className={selectedJob.attractive ? styles.attractive : styles.normalDesc}>
                  {selectedJob.attractive ? <span style={{ marginRight: 4 }}>💲</span> : null}
                  {selectedJob.attractive ? "Very attractive!!!" : selectedJob.description}
                </div>
              </div>
            </div>
            {/* Nút ứng tuyển và icon yêu thích */}
            <div className={styles.applyRow}>
              <button className={styles.applyBtn}>
                Ứng tuyển
              </button>
              <button
                className={styles.heartBtn}
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                type="button"
              >
                <span className={styles.heartIcon} style={{ color: isFavorite ? '#ff424e' : '#bbb' }}>
                  {isFavorite ? '♥' : '♡'}
                </span>
              </button>
            </div>
            <hr />
            <div className="container mx-0 px-0">
              <div className={styles.detailInfoRow}>
                <div className={styles.detailLocation}>
                  <FiMapPin style={{ marginRight: 6, fontSize: '1.1em', verticalAlign: 'middle' }} />
                  {selectedJob.location}
                </div>
                <div className={styles.detailWorkplace}>
                  <FiBriefcase style={{ marginRight: 6, marginBottom: '4px', fontSize: '1em', verticalAlign: 'middle' }} />
                  Văn phòng
                </div>
                <div className={styles.detailTime}>
                  <FiClock style={{ marginRight: 6, fontSize: '1em', verticalAlign: 'middle' }} />
                  4 giờ trước
                </div>
              </div>
              <div className={`${styles.detailInfoReq}`}>
                <div className={`${styles.detailSkill} d-flex align-items-center`}>
                  <span className={`${styles.detailLabel} me-5`}>Kỹ năng: </span>
                  <div className={styles.tagList}>
                    {selectedJob.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={`${styles.detailSkill} d-flex align-items-center`}>
                  <span className={`${styles.detailLabel} me-5`}>Chuyên môn: </span>
                  <div className={styles.tagList}>
                    <span>Kỹ sư đám mây</span>
                  </div>

                </div>
                <div className={`${styles.detailSkill} d-flex align-items-center`}>
                  <span className={`${styles.detailLabel} me-5`}>Lĩnh vực: </span>
                  <div className={styles.tagList}>
                    <span>Dịch vụ và tư vấn IT</span>
                  </div>

                </div>
              </div>
              <div className={`${styles.reason}`}>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentJob;
