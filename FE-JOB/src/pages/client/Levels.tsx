import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '@/styles/Levels.module.scss';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import ContentJob from '@/components/client/content.job';
import { useCurrentApp } from '@/components/context/app.context';

const levelData = [
    { id: 'intern', name: 'Intern', description: 'Thực tập sinh' },
    { id: 'fresher', name: 'Fresher', description: 'Mới tốt nghiệp' },
    { id: 'junior', name: 'Junior', description: 'Có 1-2 năm kinh nghiệm' },
    { id: 'middle', name: 'Middle', description: 'Có 3-5 năm kinh nghiệm' },
    { id: 'senior', name: 'Senior', description: 'Có 5+ năm kinh nghiệm' }
];

const LevelsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setFilter } = useCurrentApp();
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [showJobList, setShowJobList] = useState(false);

    // Lấy level từ URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const levelParam = params.get('level');
        if (levelParam) {
            setSelectedLevel(levelParam);
            setShowJobList(true);
            setFilter({ level: levelParam });
        }
    }, [location.search, setFilter]);

    const handleLevelClick = (level: { id: string; name: string }) => {
        setSelectedLevel(level.name);
        setShowJobList(true);
        setFilter({ level: level.name });
        navigate(`/levels?level=${encodeURIComponent(level.name)}`);
    };

    const clearFilter = () => {
        setSelectedLevel(null);
        setShowJobList(false);
        setFilter({});
        navigate('/levels');
    };

    if (showJobList && selectedLevel) {
        return (
            <div className={styles.levelsWrapper}>
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
                        Việc làm IT theo cấp bậc: <span className={styles.highlight}>{selectedLevel}</span>
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
        <div className={styles.levelsWrapper}>
            <div className={styles.backButtonContainer}>
                <button
                    onClick={() => navigate('/')}
                    className={styles.backButton}
                >
                    <FiArrowLeft size={16} />
                    Quay lại trang chủ
                </button>
            </div>

            <div className={styles.levelsHeader}>
                <h1 className={styles.levelsTitle}>Tìm việc làm IT theo cấp bậc</h1>
                <p className={styles.levelsSubtitle}>Chọn cấp bậc để xem danh sách việc làm phù hợp</p>
            </div>

            <div className={styles.levelsGrid}>
                {levelData.map((level) => (
                    <div
                        key={level.id}
                        className={styles.levelItem}
                        onClick={() => handleLevelClick(level)}
                    >
                        <div className={styles.levelName}>{level.name}</div>
                        <div className={styles.levelDescription}>{level.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LevelsPage;
