import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callFetchCompanyById } from '@/services/api';
import styles from '@/styles/Company.detail.module.scss';

const ClientCompanyDetailPage = () => {
    const { id } = useParams();
    const [company, setCompany] = useState<ICompany | null>(null);
    useEffect(() => {
        const fetchCompany = async () => {
            if (!id) return;
            const res = await callFetchCompanyById(id);
            if (res && res.data) {
                setCompany(res.data);
            }
        };
        fetchCompany();
    }, [id]);

    if (!company) return <div style={{ padding: 32 }}>Đang tải thông tin công ty...</div>;

    return (
        <div className={styles.companyDetailWrapper}>
            <div className={styles.companyDetailHeader}>
                <div className={styles.companyDetailLogo}>
                    {company.logo ? (
                        <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${company.logo}`} alt={company.name} />
                    ) : (
                        <span style={{ fontSize: 48, color: '#bbb', fontWeight: 700 }}>{company.name?.[0] || '?'}</span>
                    )}
                </div>
                <div>
                    <div className={styles.companyDetailName}>{company.name}</div>
                    <div className={styles.companyDetailAddress}>Địa chỉ: {company.address || 'Chưa cập nhật'}</div>
                </div>
            </div>
            <div className={styles.companyDetailSection}>
                <div className={styles.companyDetailSectionTitle}>Giới thiệu</div>
                <div className={styles.companyDetailDesc} dangerouslySetInnerHTML={{ __html: company.description || 'Chưa có mô tả.' }} />
            </div>
            <div className={styles.companyDetailInfoRow}>
                <div className={styles.companyDetailInfoBlock}>
                    <div className={styles.companyDetailInfoLabel}>Lĩnh vực</div>
                    <div className={styles.companyDetailInfoValue}>{company.field || 'Chưa cập nhật'}</div>
                </div>
                <div className={styles.companyDetailInfoBlock}>
                    <div className={styles.companyDetailInfoLabel}>Quy mô</div>
                    <div className={styles.companyDetailInfoValue}>{company.scale || 'Chưa cập nhật'}</div>
                </div>
                <div className={styles.companyDetailInfoBlock}>
                    <div className={styles.companyDetailInfoLabel}>Thời gian làm việc</div>
                    <div className={styles.companyDetailInfoValue}>{company.workingTime || 'Chưa cập nhật'}</div>
                </div>
            </div>
        </div>
    )
}

export default ClientCompanyDetailPage