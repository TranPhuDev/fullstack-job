import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { callFetchCompany } from '@/services/api';
import styles from '@/styles/Companies.module.scss';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import ContentJob from '@/components/client/content.job';
import { useCurrentApp } from '@/components/context/app.context';

interface ICompany {
    id?: string;
    name?: string;
    logo?: string;
    address?: string;
}

const CompaniesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setFilter } = useCurrentApp();
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [showJobList, setShowJobList] = useState(false);

    // Lấy company từ URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const companyParam = params.get('company');
        if (companyParam) {
            setSelectedCompany(companyParam);
            setShowJobList(true);
            setFilter({ company: companyParam });
        }
    }, [location.search, setFilter]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const response = await callFetchCompany('page=1&pageSize=1000');
                if (response?.data?.result) {
                    setCompanies(response.data.result);
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleCompanyClick = (company: ICompany) => {
        if (company.name) {
            setSelectedCompany(company.name);
            setShowJobList(true);
            setFilter({ company: company.name });
            navigate(`/companies?company=${encodeURIComponent(company.name)}`);
        }
    };

    const clearFilter = () => {
        setSelectedCompany(null);
        setShowJobList(false);
        setFilter({});
        navigate('/companies');
    };

    if (loading) {
        return (
            <div className={styles.companiesWrapper}>
                <div className={styles.loading}>Đang tải...</div>
            </div>
        );
    }

    if (showJobList && selectedCompany) {
        return (
            <div className={styles.companiesWrapper}>
                <div className={styles.backButtonContainer}>
                    <button
                        onClick={() => navigate('/')}
                        className={styles.backButton}
                    >
                        <FiArrowLeft size={16} />
                        Quay lại trang chủ
                    </button>
                </div>

                <div className={styles.filterHeader}>
                    <h1 className={styles.filterTitle}>
                        Việc làm IT tại công ty: <span className={styles.highlight}>{selectedCompany}</span>
                    </h1>
                    <button onClick={clearFilter} className={styles.clearFilterBtn}>
                        <FiX size={16} />
                        Xóa bộ lọc
                    </button>
                </div>

                <ContentJob />
            </div>
        );
    }

    return (
        <div className={styles.companiesWrapper}>
            <div className={styles.backButtonContainer}>
                <button
                    onClick={() => navigate('/')}
                    className={styles.backButton}
                >
                    <FiArrowLeft size={16} />
                    Quay lại trang chủ
                </button>
            </div>

            <div className={styles.companiesHeader}>
                <h1 className={styles.companiesTitle}>Tìm việc làm IT theo công ty</h1>
                <p className={styles.companiesSubtitle}>Chọn công ty để xem danh sách việc làm phù hợp</p>
            </div>

            <div className={styles.companiesGrid}>
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className={styles.companyItem}
                        onClick={() => handleCompanyClick(company)}
                    >
                        <div className={styles.companyLogo}>
                            {company.logo ? (
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${company.logo}`}
                                    alt={company.name}
                                />
                            ) : (
                                <span>{company.name?.[0] || "?"}</span>
                            )}
                        </div>
                        <div className={styles.companyName}>{company.name}</div>
                        {company.address && (
                            <div className={styles.companyAddress}>{company.address}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompaniesPage;
