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
    attractive: "You'll love it",
    description: "Làm việc với các công nghệ mới nhất. Lĩnh vực chứng khoán, tài chính hấp dẫn. Liên tục được đào tạo chuyên môn, kĩ năng.",
    detail: `- Làm việc với các công nghệ mới nhất\n- Lĩnh vực chứng khoán, tài chính hấp dẫn\n- Liên tục được đào tạo chuyên môn, kĩ năng`,
  },
  {
    id: 2,
    title: "Cloud DevOps Lead - AWS",
    company: "TymeX",
    location: "TP Hồ Chí Minh",
    tags: ["AWS", "AWS Lambda", "Kafka", "Java", "Microservices"],
    attractive: "You'll love it",
    description: "You'll love it",
    detail: `- Quản lý hệ thống cloud\n- Lãnh đạo team DevOps\n- Làm việc với AWS Lambda, Kafka, Java, Microservices`,
  },
  {
    id: 3,
    title: "Information Security Engineer (Networking, System, Risk)",
    company: "ABC Corp",
    location: "Hà Nội",
    tags: ["Security", "Networking", "System", "Risk"],
    attractive: "You'll love it",
    
    description: "Cơ hội phát triển chuyên sâu về bảo mật",
    detail: `- Đánh giá rủi ro hệ thống\n- Triển khai giải pháp bảo mật\n- Làm việc với các hệ thống lớn`,
  },
  {
    id: 4,
    title: "Information Security Engineer (Networking, System, Risk)",
    company: "ABC Corp",
    location: "Hà Nội",
    tags: ["Security", "Networking", "System", "Risk"],
    attractive: "You'll love it",
    
    description: "Cơ hội phát triển chuyên sâu về bảo mật",
    detail: `- Đánh giá rủi ro hệ thống\n- Triển khai giải pháp bảo mật\n- Làm việc với các hệ thống lớn`,
  },
  {
    id: 5,
    title: "Information Security Engineer (Networking, System, Risk)",
    company: "ABC Corp",
    location: "Hà Nội",
    tags: ["Security", "Networking", "System", "Risk"],
    attractive: "You'll love it",
  
    description: "Cơ hội phát triển chuyên sâu về bảo mật",
    detail: `- Đánh giá rủi ro hệ thống\n- Triển khai giải pháp bảo mật\n- Làm việc với các hệ thống lớn`,
  },
  {
    id: 6,
    title: "Information Security Engineer (Networking, System, Risk)",
    company: "ABC Corp",
    location: "Hà Nội",
    tags: ["Security", "Networking", "System", "Risk"],
    attractive: "You'll love it",

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
                <div className={styles.hotTag}>HOT</div>
                <div className={styles.jobTitle}>{job.title}</div>
                <div className={styles.jobListCompanyRow}>
                  <div className={styles.companyLogo} style={{ width: 40, height: 40, fontSize: '1.2rem' }}>
                    {job.company?.[0] || "?"}
                  </div>
                  <div className={styles.jobCompany}>{job.company}-{job.location}</div>
                </div>
                <div className={styles.attractive}>
                  {job.attractive}
                </div>
                <div className={styles.horizontal}></div>
                <div className={styles.jobMeta}>
                  <div className={styles.jobTitleRow}>
                    <FiBriefcase className={styles.metaIcon} />
                    <a href="#" className={styles.jobLink}>Lập trình viên Game</a>
                  </div>
                  <div className={styles.jobInfoRow}>
                    <span>
                      <span className={styles.metaIcon}>
                        <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#b1acad" d="M8 1.333a2.667 2.667 0 0 0-2.667 2.667v1.333H4A2.667 2.667 0 0 0 1.333 8v4A2.667 2.667 0 0 0 4 14.667h8A2.667 2.667 0 0 0 14.667 12V8A2.667 2.667 0 0 0 12 5.333h-.667V4A2.667 2.667 0 0 0 8 1.333zm0 1.334A1.333 1.333 0 0 1 9.333 4v1.333H6.667V4A1.333 1.333 0 0 1 8 2.667zM4 6.667h8A1.333 1.333 0 0 1 13.333 8v4A1.333 1.333 0 0 1 12 13.333H4A1.333 1.333 0 0 1 2.667 12V8A1.333 1.333 0 0 1 4 6.667zm2.667 2.666a.667.667 0 1 0 0 1.334.667.667 0 0 0 0-1.334z"/></svg>
                      </span>
                      <span className={styles.boldGray}>Tại văn phòng</span>
                    </span>
                    <span className={styles.dot}>•</span>
                    <span>
                      <FiMapPin className={styles.metaIcon} />
                      <span className={styles.grayText}>TP Hồ Chí Minh</span>
                    </span>
                  </div>
                </div>
                <div className={styles.tagList}>
                  {job.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
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
                <div className={styles.attractive}>
                  {selectedJob.attractive}
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
            <div className={styles.detailScrollable}>
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
              <div className={styles.reason}>
                <div className={styles.reasonTitle}>3 Lý do để gia nhập công ty</div>
                <ul className={styles.reasonList}>
                  <li>Chế độ bảo hiểm PVI cao cấp</li>
                  <li>Du lịch nghỉ dưỡng hằng năm</li>
                  <li>Thưởng hấp dẫn vào các dịp lễ, Tết</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentJob;
