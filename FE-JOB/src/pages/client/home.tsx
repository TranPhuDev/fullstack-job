import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/home.module.scss';
import { FiSearch, FiChevronDown, FiMapPin } from 'react-icons/fi';
import FeaturedEmployer from '@/components/client/featured.employer';
import ContentJob from '@/components/client/content.job';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentApp } from '@/components/context/app.context';

const cities = [
  { value: '', label: 'Tất cả thành phố' },
  { value: 'HANOI', label: 'Hà Nội' },
  { value: 'HOCHIMINH', label: 'Hồ Chí Minh' },
  { value: 'DANANG', label: 'Đà Nẵng' },
  { value: 'OTHER', label: 'Khác' }
];

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHidingDropdownOverlay, setIsHidingDropdownOverlay] = useState(false);
  const [isShowingDropdownOverlay, setIsShowingDropdownOverlay] = useState(false);
  const [showInputOverlay, setShowInputOverlay] = useState(false);
  const [isHidingInputOverlay, setIsHidingInputOverlay] = useState(false);
  const [isShowingInputOverlay, setIsShowingInputOverlay] = useState(false);
  const [selected, setSelected] = useState(cities[0]);
  const [keyword, setKeyword] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setFilter, filter } = useCurrentApp();
  const navigate = useNavigate();

  // Đọc parameter company từ URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const companyParam = params.get("company");
  const skillParam = params.get("skill");
  const levelParam = params.get("level");

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (showDropdown) {
          setShowDropdown(false);
          setIsHidingDropdownOverlay(false);
          setIsShowingDropdownOverlay(false);
        }
      }
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        if (showInputOverlay) {
          setShowInputOverlay(false);
          setIsHidingInputOverlay(false);
          setIsShowingInputOverlay(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, showInputOverlay]);

  // Hiệu ứng fade-in overlay khi mount
  useEffect(() => {
    if (showDropdown) {
      setTimeout(() => setIsShowingDropdownOverlay(true), 0);
    }
  }, [showDropdown]);
  useEffect(() => {
    if (showInputOverlay) {
      setTimeout(() => setIsShowingInputOverlay(true), 0);
    }
  }, [showInputOverlay]);

  // Khi vào trang, nếu có các param trên URL thì set filter và clear các filter khác
  useEffect(() => {
    if (companyParam) {
      setFilter({ company: companyParam });
      setSelected(cities[0]);
      setKeyword("");
    } else if (skillParam) {
      setFilter({ skill: skillParam });
      setSelected(cities[0]);
      setKeyword("");
    } else if (levelParam) {
      setFilter({ level: levelParam });
      setSelected(cities[0]);
      setKeyword("");
    } else {
      // Nếu không có param nào, clear tất cả filter
      setFilter({});
      setSelected(cities[0]);
      setKeyword("");
    }
  }, [companyParam, skillParam, levelParam, setFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear các filter cũ và set filter mới
    setFilter({
      city: selected.value,
      keyword: keyword
    });
    navigate('/');
    // Blur the button to remove :active state
    const btn = document.activeElement as HTMLElement;
    if (btn && btn.tagName === 'BUTTON') btn.blur();
  };

  const clearAllFilters = () => {
    setFilter({});
    setSelected(cities[0]);
    setKeyword("");
    navigate('/');
  };

  // Kiểm tra xem có filter nào đang active không
  const hasActiveFilter = filter.company || filter.skill || filter.level || filter.city || filter.keyword;

  return (
    <div className={styles.homeTopSection}>
      <div className={styles.homeBanner + ' ' + styles.searchBanner}>
        {showDropdown && (
          <div className={
            styles.customDropdownOverlay +
            (isHidingDropdownOverlay ? ' ' + styles.overlayHide : '') +
            (isShowingDropdownOverlay ? ' ' + styles.overlayShow : '')
          }></div>
        )}
        {showInputOverlay && (
          <div className={
            styles.inputOverlay +
            (isHidingInputOverlay ? ' ' + styles.overlayHide : '') +
            (isShowingInputOverlay ? ' ' + styles.overlayShow : '')
          }></div>
        )}

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.inputGroup}>
            <div
              className={
                styles.selectWrapper +
                (showDropdown ? ' ' + styles.activeSelectWrapper : showInputOverlay ? ' ' + styles.inactiveSelectWrapper : '')
              }
              ref={wrapperRef}
              onClick={() => {
                if (!showDropdown) {
                  setShowDropdown(true);
                } else {
                  setShowDropdown(false);
                  setIsHidingDropdownOverlay(false);
                  setIsShowingDropdownOverlay(false);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <div
                className={styles.selectCity}
                style={{ cursor: 'pointer' }}
              >
                <FiMapPin className={styles.locationIcon} />
                <span className={styles.selectCityText}>{selected.label}</span>
                <FiChevronDown className={styles.selectIcon} />
              </div>
              {showDropdown && (
                <div className={styles.customDropdown}>
                  {cities.map((city) => (
                    <div
                      key={city.value}
                      className={
                        styles.customDropdownOption +
                        (selected.value === city.value ? ' ' + styles.customDropdownOptionSelected : '')
                      }
                      onClick={() => {
                        setSelected(city);
                        setShowDropdown(false);
                        setIsHidingDropdownOverlay(false);
                        setIsShowingDropdownOverlay(false);
                        // KHÔNG setFilter, KHÔNG navigate ở đây!
                      }}
                    >
                      {city.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              className={
                styles.searchInput +
                (showInputOverlay ? ' ' + styles.activeSearchInput : showDropdown ? ' ' + styles.inactiveSearchInput : '')
              }
              placeholder="Nhập từ khoá theo kỹ năng, chức vụ, công ty..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onFocus={() => {
                if (!showInputOverlay) {
                  setShowInputOverlay(true);
                }
              }}
            />
            <button className={styles.searchBtn}>
              <FiSearch style={{ marginRight: 8, fontSize: 20 }} /> Tìm Kiếm
            </button>
          </div>
        </form>
      </div>
      <div className={styles.containerBg}>

        <div className={styles.featuredEmployerOverlap}>
          <FeaturedEmployer />
        </div>

        {/* Hiển thị filter đang active - di chuyển xuống dưới Featured Employer */}
        {hasActiveFilter && (
          <div className={styles.activeFilterBanner}>
            <div className={styles.activeFilterContent}>
              <span className={styles.activeFilterText}>
                Đang lọc theo:
                {filter.company && <span className={styles.filterTag}>Công ty: {filter.company}</span>}
                {filter.skill && <span className={styles.filterTag}>Kỹ năng: {filter.skill}</span>}
                {filter.level && <span className={styles.filterTag}>Cấp bậc: {filter.level}</span>}
                {filter.city && <span className={styles.filterTag}>Thành phố: {cities.find(c => c.value === filter.city)?.label}</span>}
                {filter.keyword && <span className={styles.filterTag}>Từ khóa: {filter.keyword}</span>}
              </span>
              <button onClick={clearAllFilters} className={styles.clearAllFiltersBtn}>
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}

        <div className="container">
          <div className="row">
            <div className="col-12">
              <ContentJob />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
