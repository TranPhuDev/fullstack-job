import React, { useState, useEffect } from "react";
import { FiMapPin, FiClock, FiBriefcase } from "react-icons/fi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import styles from "../../styles/content.job.module.scss";
import { MdLaptopChromebook } from "react-icons/md";
import { callFetchJob, callFetchJobById } from '@/services/api';
import Pagination from '@/components/common/Pagination';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import "dayjs/locale/vi";
import ApplyModal from "./modal.apply";
import { useLocation, Link } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import ContentJobRight from "./content.job.right";
dayjs.extend(relativeTime);

const ContentJob = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [favoriteJobs, setFavoriteJobs] = useState<string[]>([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
  const topRef = React.useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [jobDetail, setJobDetail] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useCurrentApp();


  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id");


  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true)
        const res = await callFetchJobById(id);
        if (res?.data) {
          setJobDetail(res.data)
        }
        setIsLoading(false)
      }
    }
    init();
  }, [id]);



  useEffect(() => {
    fetchJobs(meta.page, meta.pageSize);
    // eslint-disable-next-line
  }, [meta.page, meta.pageSize]);

  const fetchJobs = async (page: number, pageSize: number) => {
    try {
      const res = await callFetchJob(`page=${page}&size=${pageSize}`);
      const data = res?.data?.result || [];
      const total = res?.data?.meta?.total || 0;
      setJobs(data);
      setSelectedJob(data[0] || null);
      setMeta((prev) => ({ ...prev, total }));
    } catch {
      setJobs([]);
      setSelectedJob(null);
      setMeta((prev) => ({ ...prev, total: 0 }));
    }
  };

  const handlePageChange = (page: number) => {
    setMeta((prev) => ({ ...prev, page }));
    setTimeout(() => {
      if (topRef.current) {
        window.scrollTo({ top: topRef.current.offsetTop, behavior: 'smooth' });
      }
    }, 0);
  };

  const isFavorite = !!selectedJob && favoriteJobs.includes(selectedJob.id || '');
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
    <div className="container mt-3" ref={topRef}>
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
                {job.salary && job.salary > 30000000 ? (
                  <div className={styles.superHotTag}>
                    <svg style={{marginRight : '8px' , marginBottom : '5px'}} fill="none" height="15" viewBox="0 0 12 15" width="12" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M8.35103 7.22088C8.77945 5.51855 9.97941 4.56322 11.074 4.45661C9.84457 6.98536 12.8712 8.79743 11.1649 11.8192C10.2049 13.5193 8.33941 14.4836 6.25533 14.4997C0.303047 14.5458 -0.829202 8.4487 1.27822 4.29598C0.712659 8.76776 4.77576 8.50349 3.49039 5.62166C2.56746 3.55246 4.57378 0.432578 7.73614 0.50111C5.5579 3.61357 8.78633 4.4127 8.35103 7.22088Z" fill="#FFDD85" fill-rule="evenodd"></path>
</svg>
                    SUPER HOT</div>
                ) : (
                  <div className={styles.hotTag}>HOT</div>
                )}
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
                  <span style={{ lineHeight: 1 }}> {isAuthenticated
                    ? `You'll love it - ${job.salary ? job.salary.toLocaleString('vi-VN') + ' đ' : ''}`
                    : "Đăng nhập để xem mức lương"}</span>
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
          <ContentJobRight
            selectedJob={selectedJob}
            setJobDetail={setJobDetail}
            setIsModalOpen={setIsModalOpen}
            isFavorite={isFavorite}
            handleToggleFavorite={handleToggleFavorite}
            isAuthenticated={isAuthenticated}
          />
        </div>

      </div>
      <div className="row">
        <div className="col-12">
          <Pagination
            current={meta.page}
            total={meta.total}
            pageSize={meta.pageSize}
            onChange={handlePageChange}
          />
        </div>
      </div>
      <ApplyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        jobDetail={jobDetail}
      />
    </div>
  );
};

export default ContentJob;