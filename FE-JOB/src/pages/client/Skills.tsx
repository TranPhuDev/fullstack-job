import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { callFetchAllSkillsForJob, callFetchJob } from '@/services/api';
import styles from '@/styles/Skills.module.scss';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import ContentJob from '@/components/client/content.job';
import { useCurrentApp } from '@/components/context/app.context';

interface ISkill {
    id?: string;
    name?: string;
}

const SkillsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setFilter } = useCurrentApp();
    const [skills, setSkills] = useState<ISkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [showJobList, setShowJobList] = useState(false);

    // Lấy skill từ URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const skillParam = params.get('skill');
        if (skillParam) {
            setSelectedSkill(skillParam);
            setShowJobList(true);
            setFilter({ skill: skillParam });
        }
    }, [location.search, setFilter]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const response = await callFetchAllSkillsForJob();
                if (response?.data) {
                    setSkills(response.data);
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const handleSkillClick = (skill: ISkill) => {
        if (skill.name) {
            setSelectedSkill(skill.name);
            setShowJobList(true);
            setFilter({ skill: skill.name });
            navigate(`/skills?skill=${encodeURIComponent(skill.name)}`);
        }
    };

    const clearFilter = () => {
        setSelectedSkill(null);
        setShowJobList(false);
        setFilter({});
        navigate('/skills');
    };

    if (loading) {
        return (
            <div className={styles.skillsWrapper}>
                <div className={styles.loading}>Đang tải...</div>
            </div>
        );
    }

    if (showJobList && selectedSkill) {
        return (
            <div className={styles.skillsWrapper}>
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
                        Việc làm IT theo kỹ năng: <span className={styles.highlight}>{selectedSkill}</span>
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
        <div className={styles.skillsWrapper}>
            <div className={styles.backButtonContainer}>
                <button
                    onClick={() => navigate('/')}
                    className={styles.backButton}
                >
                    <FiArrowLeft size={16} />
                    Quay lại trang chủ
                </button>
            </div>

            <div className={styles.skillsHeader}>
                <h1 className={styles.skillsTitle}>Tìm việc làm IT theo kỹ năng</h1>
                <p className={styles.skillsSubtitle}>Chọn kỹ năng để xem danh sách việc làm phù hợp</p>
            </div>

            <div className={styles.skillsGrid}>
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className={styles.skillItem}
                        onClick={() => handleSkillClick(skill)}
                    >
                        {skill.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsPage;
