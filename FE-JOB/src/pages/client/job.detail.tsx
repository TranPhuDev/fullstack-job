import ContentJobRight from "@/components/client/content.job.right";
import { callFetchJobById } from "@/services/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import styles from "../../styles/job.detail.module.scss";
import ApplyModal from "@/components/client/modal.apply";
import LikeModal from "@/components/client/modal.like";
import { FiArrowLeft } from "react-icons/fi";

type CompanyFull = {
    id: string;
    name: string;
    address: string;
    logo?: string;
    description?: string;
    scale?: string;
    field?: string;
    size?: string;
    workingTime?: string;
    overTime?: string;
};

const ClientDetailJobPage = () => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const { id } = useParams(); // lấy id từ URL /job/:id
    const { isAuthenticated } = useCurrentApp();
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [rating, setRating] = useState(() => (Math.random() * 2 + 3).toFixed(1));
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showLikeModal, setShowLikeModal] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const navigate = useNavigate();

    const randomRating = () => {
        const newRating = (Math.random() * 2 + 3).toFixed(1);
        setRating(newRating);
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const init = async () => {
            if (id) {
                const res = await callFetchJobById(id);
                if (res?.data) {
                    setJobDetail(res.data)
                }
            }
        }
        init();
    }, [id]);

    return (
        <div className={`${styles.containerJob}`}>
            <div className="container">
                {/* Back Button - Hiển thị rõ ràng trên mobile */}
                {isMobile && (
                    <div style={{ marginBottom: "16px", marginTop: "16px" }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                background: "white",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#333"
                            }}
                        >
                            <FiArrowLeft size={16} />
                            Quay lại
                        </button>
                    </div>
                )}
                <div className="row">
                    {/* Job Detail - Full width on mobile, col-8 on desktop */}
                    <div className={isMobile ? "col-12" : "col-8"} style={{ marginTop: isMobile ? "12px" : "12px" }}>
                        <ContentJobRight
                            selectedJob={jobDetail}
                            setJobDetail={setJobDetail}
                            setIsModalOpen={setIsModalOpen}
                            setShowLikeModal={setShowLikeModal}
                            isDetailPage={true}
                        />
                    </div>

                    {/* Company Card - Full width on mobile, col-4 on desktop */}
                    {jobDetail?.company && (
                        <div className={isMobile ? "col-12" : "col-4"} style={{ paddingBottom: isMobile ? "20px" : "20px" }}>
                            <div className={styles.companyCard}>
                                <div className={styles.companyHeader}>
                                    <img
                                        src={jobDetail.company.logo
                                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company.logo}`
                                            : "/default-logo.png"}
                                        alt={jobDetail.company.name}
                                        className={styles.companyLogo}
                                    />
                                    <div>
                                        <div className={styles.companyName}>{jobDetail.company.name}</div>
                                        <div
                                            className={styles.companyRating}
                                            onClick={randomRating}
                                            style={{ cursor: "pointer", userSelect: "none" }}
                                            title="Click để random số sao"
                                        >
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} style={{ color: i < Math.floor(Number(rating)) ? "#FFA500" : "#ccc" }}>★</span>
                                            ))}
                                            <span style={{ marginLeft: 6, fontWeight: 600 }}>{rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={styles.companyDesc}
                                >
                                    {(() => {
                                        const desc = (jobDetail.company as CompanyFull).description || "";
                                        const shortDesc = desc.slice(0, 800);
                                        return (
                                            <>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: showFullDesc ? desc : shortDesc + (desc.length > 250 ? "..." : "")
                                                    }}
                                                />
                                                {desc.length > 200 && (
                                                    <button
                                                        className={styles.seeMoreBtn}
                                                        onClick={() => setShowFullDesc((prev) => !prev)}
                                                        style={{ border: "none", background: "none", color: "#ff424e", cursor: "pointer", padding: 0, marginTop: 4 }}
                                                    >
                                                        {showFullDesc ? "Thu gọn" : "Xem thêm"}
                                                    </button>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                                <div className={styles.companyInfoRow}>
                                    <span>Lĩnh vực công ty</span>
                                    <span>{(jobDetail.company as CompanyFull).field || "N/A"}</span>
                                </div>
                                <div className={styles.companyInfoRow}>
                                    <span>Quy mô công ty</span>
                                    <span>{(jobDetail.company as CompanyFull).scale + " nhân viên" || "N/A"}</span>
                                </div>
                                <div className={styles.companyInfoRow}>
                                    <span>Thời gian làm việc</span>
                                    <span>{(jobDetail.company as CompanyFull).workingTime || "N/A"}</span>
                                </div>
                                <div className={styles.companyInfoRow}>
                                    <span>Làm việc ngoài giờ</span>
                                    <span>{(jobDetail.company as CompanyFull).overTime || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ApplyModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                jobDetail={jobDetail}
            />
            <LikeModal open={showLikeModal} onClose={() => setShowLikeModal(false)} />
        </div>
    );
}

export default ClientDetailJobPage;