import React from "react";
import { FiMapPin, FiClock, FiBriefcase } from "react-icons/fi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import styles from "../../styles/content.job.module.scss";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Link } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import { App } from 'antd';

interface ContentJobRightProps {
  selectedJob: IJob | null;
  setJobDetail: (job: IJob | null) => void;
  setIsModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setShowLikeModal?: (open: boolean) => void; // Thêm props để mở modal like
}

const ContentJobRight: React.FC<ContentJobRightProps> = ({
  selectedJob,
  setJobDetail,
  setIsModalOpen,
  isAuthenticated,
  setShowLikeModal,
}) => {
  const { likedJobs, toggleLikeJob, user } = useCurrentApp();
  const isJobLiked = selectedJob && likedJobs.some(j => j.id === selectedJob.id);
  const { notification } = App.useApp();

  const handleLikeJob = () => {
    if (!selectedJob) return;
    if (!user) {
      notification.warning({
        message: 'Bạn cần đăng nhập để sử dụng tính năng này',
        duration: 2
      });
      return;
    }
    if (!isJobLiked) {
      toggleLikeJob(selectedJob);
      notification.success({
        message: 'Thành công',
        description: <div>
          Việc làm đã lưu vào mục công việc yêu thích.<br />
          <span
            style={{ color: '#1677ff', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => setShowLikeModal && setShowLikeModal(true)}
          >
            Xem danh sách
          </span>
        </div>,
        duration: 3
      });
    } else {
      toggleLikeJob(selectedJob);
      notification.info({
        message: 'Đã bỏ yêu thích việc làm',
        duration: 2
      });
    }
  };
  return (
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
              <Link to={`/job/${selectedJob.id}`} className={styles.detailTitle}>
                {selectedJob.name}
              </Link>
              <div className={styles.detailCompany}>{selectedJob.company?.name}</div>
              <div className={styles.attractive} style={{ display: 'flex', alignItems: 'center' }}>
                <AiOutlineDollarCircle style={{ fontSize: 22, marginRight: 8 }} />
                {user ? (
                  <span style={{ lineHeight: 1 }}>
                    You'll love it - {selectedJob.salary ? selectedJob.salary.toLocaleString('vi-VN') + ' đ' : ''}
                  </span>
                ) : (
                  <span style={{ lineHeight: 1, fontWeight: 500, cursor: 'pointer' }} onClick={() => window.location.href = '/client/auth/login'}>
                    Đăng nhập để xem mức lương
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Nút ứng tuyển và icon yêu thích */}
          <div className={styles.applyRow}>
            <button
              onClick={() => {
                setJobDetail(selectedJob);
                setIsModalOpen(true);
              }}
              className={styles.applyBtn}
            >
              Ứng tuyển
            </button>
            <button
              className={styles.heartBtn}
              onClick={handleLikeJob}
              aria-label={isJobLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
              type="button"
            >
              <span className={styles.heartIcon} style={{ color: isJobLiked ? '#ff424e' : '#bbb' }}>
                {isJobLiked ? '♥' : '♡'}
              </span>
            </button>
          </div>
          <hr />
          <div className={styles.detailScrollable}>
            <div className={styles.detailInfoRow}>

              <div className={styles.detailLocation}>
                <FiBriefcase style={{ marginRight: 6, fontSize: '1.1em', verticalAlign: 'middle' }} />
                {selectedJob.level}
              </div>

              <div className={styles.detailLocation}>
                <FiMapPin style={{ marginRight: 6, fontSize: '1.1em', verticalAlign: 'middle' }} />
                {selectedJob.company?.address}
              </div>
              <div className={styles.detailWorkplace}>
                <svg style={{ marginRight: 6, fontSize: '1.1em', verticalAlign: 'middle', marginBottom: '2px' }} width="16" height="16" viewBox="0 0 16 16"><path fill="#b1acad" d="M8 1.333a2.667 2.667 0 0 0-2.667 2.667v1.333H4A2.667 2.667 0 0 0 1.333 8v4A2.667 2.667 0 0 0 4 14.667h8A2.667 2.667 0 0 0 14.667 12V8A2.667 2.667 0 0 0 12 5.333h-.667V4A2.667 2.667 0 0 0 8 1.333zm0 1.334A1.333 1.333 0 0 1 9.333 4v1.333H6.667V4A1.333 1.333 0 0 1 8 2.667zM4 6.667h8A1.333 1.333 0 0 1 13.333 8v4A1.333 1.333 0 0 1 12 13.333H4A1.333 1.333 0 0 1 2.667 12V8A1.333 1.333 0 0 1 4 6.667zm2.667 2.666a.667.667 0 1 0 0 1.334.667.667 0 0 0 0-1.334z" /></svg>

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
              <div dangerouslySetInnerHTML={{ __html: selectedJob.description || '' }} />
            </div>
            {selectedJob.company && (() => {
              const companyInfo = typeof selectedJob.company === 'object' && selectedJob.company ? selectedJob.company as { scale?: string, field?: string, workingTime?: string, overTime?: string } : {};
              return (
                <div className={styles.companyInfoGrid} style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  marginTop: 24,
                }}>
                  <div>
                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15 }}>Mô hình công ty</div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{companyInfo.scale || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15 }}>Lĩnh vực công ty</div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{companyInfo.field || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15 }}>Quy mô công ty</div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{companyInfo.scale || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15 }}>Thời gian làm việc</div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{companyInfo.workingTime || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15 }}>Làm việc ngoài giờ</div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{companyInfo.overTime || 'N/A'}</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>

  );
};

export default ContentJobRight;