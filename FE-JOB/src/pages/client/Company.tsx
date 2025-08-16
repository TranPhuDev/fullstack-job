import { useEffect, useState } from 'react';
import { callFetchCompany } from '@/services/api';
import styles from '@/styles/Company.module.scss';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function getFirstLineFromHtml(html: string): string {
    // Tách theo <br> hoặc \n hoặc kết thúc thẻ block
    const div = document.createElement('div');
    div.innerHTML = html;
    // Lấy text đến <br> hoặc xuống dòng đầu tiên
    let text = '';
    for (const node of div.childNodes) {
        if (node.nodeType === 3) { // text node
            const value = node.textContent || '';
            const idx = value.indexOf('\n');
            if (idx !== -1) {
                text += value.slice(0, idx);
                break;
            } else {
                text += value;
            }
        } else if (node.nodeType === 1 && (node as HTMLElement).tagName === 'BR') {
            break;
        } else if (node.nodeType === 1) {
            text += (node as HTMLElement).innerText.split('\n')[0];
            break;
        }
    }
    return text.trim();
}

const ClientCompanyPage = () => {
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCompanies = async () => {
            const res = await callFetchCompany('page=1&pageSize=100');
            if (res && res.data && res.data.result) {
                setCompanies(res.data.result);
            }
        };
        fetchCompanies();
    }, []);

    return (
        <div className={styles.companyWrapper}>
            {/* Nút Quay lại trang chủ */}
            <div className={styles.backButtonContainer}>
                <button
                    onClick={() => navigate('/')}
                    className={styles.backButton}
                >
                    <FiArrowLeft size={16} />
                    Quay lại trang chủ
                </button>
            </div>

            <h2 className={styles.companyTitle}>Danh sách công ty IT tốt nhất 2025</h2>
            {companies.map((company, idx) => (
                <div key={company.id} className={styles.companyItem}>
                    <div className={styles.companyRank}>{idx + 1}</div>
                    <div className={styles.companyLogo}>
                        {company.logo ? (
                            <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${company.logo}`} alt={company.name} />
                        ) : (
                            <span style={{ fontSize: 32, color: '#bbb', fontWeight: 700 }}>{company.name?.[0] || '?'}</span>
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div
                            className={styles.companyNameLink}
                            onClick={() => navigate(`/company/${company.id}`)}
                        >
                            {company.name}
                        </div>
                        <div className={styles.companyDesc}>
                            {getFirstLineFromHtml(company.description || 'Chưa có mô tả.')}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ClientCompanyPage