import React, { useState, useEffect } from "react";
import { FiMapPin, FiClock, FiBriefcase } from "react-icons/fi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import styles from "../../styles/content.job.module.scss";
import { MdLaptopChromebook } from "react-icons/md";
import { callFetchJob } from '@/services/api';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import "dayjs/locale/vi";
dayjs.extend(relativeTime);

const ContentJob = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [favoriteJobs, setFavoriteJobs] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await callFetchJob('page=1&size=10');
        const data = res?.data?.result || [];
        setJobs(data);
        setSelectedJob(data[0] || null);
      } catch {
        setJobs([]);
        setSelectedJob(null);
      }
    };
    fetchJobs();
  }, []);

  const isFavorite = selectedJob && favoriteJobs.includes(selectedJob.id || '');
  const handleToggleFavorite = () => {
    if (!selectedJob || !selectedJob.id) return;
    setFavoriteJobs((prev) =>
      isFavorite ? prev.filter((id) => id !== selectedJob.id) : [...prev, selectedJob.id!]
    );
  };

  // Hàm chuyển location code sang tên tiếng Việt
  const mapLocation = (location?: string) => {
    if (!location) return '';
    const map: Record<string, string> = {
      HOCHIMINH: 'Hồ Chí Minh',
      HANOI: 'Hà Nội',
      DANANG: 'Đà Nẵng',
      HUE: 'Huế',
      // Thêm các mapping khác nếu cần
    };
    return map[location.toUpperCase()] || location;
  };

  return (
    <div className="container mt-3">
      <div className="row">
        {/* Danh sách job bên trái */}
        <div className="col-5 ">
          <div className={styles.jobListWrapper}>
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={
                  selectedJob && job.id === selectedJob.id
                    ? `${styles.jobItem} ${styles.selected}`
                    : styles.jobItem
                }
              >
                <div className={styles.hotTag}>HOT</div>
                <div className={styles.timePost}>
                  Đã đăng {job.updatedAt ? dayjs(job.updatedAt).locale('vi').fromNow() : (job.updatedAt ? dayjs(job.updatedAt).locale('vi').fromNow() : '')}
                </div>
                <div className={styles.jobTitle}>{job.name}</div>
                <div className={styles.jobListCompanyRow}>
                  <div className={styles.companyLogo} style={{ width: 40, height: 40, fontSize: '1.2rem' }}>
                    {job.company?.logo ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.company.logo}`}
                        alt={job.company.name}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      job.company?.name?.[0] || "?"
                    )}
                  </div>
                  <div className={styles.jobCompany}>{job.company?.name}</div>
                </div>
                <div className={styles.attractive} style={{ display: 'flex', alignItems: 'center' }}>
                  <AiOutlineDollarCircle style={{ fontSize: 22, marginRight: 8 }} />
                  <span style={{ lineHeight: 1 }}>You'll love it</span>
                </div>
                <div className={styles.horizontal}></div>
                <div className={styles.jobMeta}>
                  <div className={styles.level}>
                    <FiBriefcase className={styles.metaIcon} />
                    <a href="#" className={styles.jobLink} >Chấp nhận {job.level ? job.level.charAt(0).toUpperCase() + job.level.slice(1).toLowerCase() : ''}</a>
                  </div>
                  <div className={styles.jobTitleRow}>
                    <MdLaptopChromebook className={`${styles.metaIcon} ${styles.gameIcon}`} />
                    <a href="#" className={styles.jobLink}>Lập trình viên {job.expertise}</a>
                  </div>
                  <div className={styles.jobInfoRow}>
                    <span>
                      <span className={styles.metaIcon}>
                        <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#b1acad" d="M8 1.333a2.667 2.667 0 0 0-2.667 2.667v1.333H4A2.667 2.667 0 0 0 1.333 8v4A2.667 2.667 0 0 0 4 14.667h8A2.667 2.667 0 0 0 14.667 12V8A2.667 2.667 0 0 0 12 5.333h-.667V4A2.667 2.667 0 0 0 8 1.333zm0 1.334A1.333 1.333 0 0 1 9.333 4v1.333H6.667V4A1.333 1.333 0 0 1 8 2.667zM4 6.667h8A1.333 1.333 0 0 1 13.333 8v4A1.333 1.333 0 0 1 12 13.333H4A1.333 1.333 0 0 1 2.667 12V8A1.333 1.333 0 0 1 4 6.667zm2.667 2.666a.667.667 0 1 0 0 1.334.667.667 0 0 0 0-1.334z" /></svg>
                      </span>
                      <span className={styles.boldGray}>{job.workplace} </span>
                    </span>
                    <span className={styles.dot}>•</span>
                    <span>
                      <FiMapPin className={styles.metaIcon} />
                      <span className={styles.grayText}>{mapLocation(job.location)}</span>
                    </span>
                  </div>
                </div>
                <div className={styles.tagList}>
                  {job.skills?.map((skill) => (
                    <span key={skill.id} className={styles.tag}>{skill.name}</span>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Chi tiết job bên phải */}
        <div className="col-7">
          <div className={styles.detailWrapper}>
            {selectedJob && (
              <>
                <div className={styles.detailHeaderRow}>
                  <div className={styles.companyLogo}>
                    {selectedJob.company?.logo ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${selectedJob.company.logo}`}
                        alt={selectedJob.company.name}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      selectedJob.company?.name?.[0] || "?"
                    )}
                  </div>
                  <div className={styles.detailInfoBlock}>
                    <h2 className={styles.detailTitle}>{selectedJob.name}</h2>
                    <div className={styles.detailCompany}>{selectedJob.company?.name}</div>
                    <div className={styles.attractive} style={{ display: 'flex', alignItems: 'center' }}>
                      <AiOutlineDollarCircle style={{ fontSize: 22, marginRight: 8 }} />
                      <span style={{ lineHeight: 1 }}>You'll love it</span>
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
                      {mapLocation(selectedJob.location)}
                    </div>
                    <div className={styles.detailWorkplace}>
                      <FiBriefcase style={{ marginRight: 6, marginBottom: '4px', fontSize: '1em', verticalAlign: 'middle' }} />
                      {selectedJob.workplace ? selectedJob.workplace.charAt(0).toUpperCase() + selectedJob.workplace.slice(1).toLowerCase() : ''}
                    </div>
                    <div className={styles.detailTime}>
                      <FiClock style={{ marginRight: 6, fontSize: '1em', verticalAlign: 'middle' }} />
                      {selectedJob.updatedAt ? dayjs(selectedJob.updatedAt).locale('vi').fromNow() : ''}
                    </div>
                  </div>
                  <div className={`${styles.detailInfoReq}`}>
                    <div className={`${styles.detailSkill} d-flex align-items-center`}>
                      <span className={`${styles.detailLabel} me-5`}>Kỹ năng: </span>
                      <div className={styles.tagList}>
                        {selectedJob.skills?.map((skill) => (
                          <span key={skill.id} className={styles.tag}>{skill.name}</span>
                        ))}
                      </div>
                    </div>
                    <div className={`${styles.detailSkill} d-flex align-items-center`}>
                      <span className={`${styles.detailLabel} me-5`}>Chuyên môn: </span>
                      <div className={styles.tagList}>
                        <span>{selectedJob.expertise}</span>
                      </div>
                    </div>
                    <div className={`${styles.detailSkill} d-flex align-items-center`}>
                      <span className={`${styles.detailLabel} me-5`}>Lĩnh vực: </span>
                      <div className={styles.tagList}>
                        <span>{typeof selectedJob.company === 'object' && selectedJob.company && 'field' in selectedJob.company ? (selectedJob.company as { field?: string }).field || 'N/A' : 'N/A'}</span>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentJob;