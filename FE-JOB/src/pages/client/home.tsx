import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/home.module.scss';
import { FiSearch, FiChevronDown, FiMapPin } from 'react-icons/fi';

const cities = [
  { value: '', label: 'Tất cả thành phố' },
  { value: 'hanoi', label: 'Hà Nội' },
  { value: 'hcm', label: 'Hồ Chí Minh' },
  { value: 'danang', label: 'Đà Nẵng' },
];

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHidingDropdownOverlay, setIsHidingDropdownOverlay] = useState(false);
  const [isShowingDropdownOverlay, setIsShowingDropdownOverlay] = useState(false);
  const [showInputOverlay, setShowInputOverlay] = useState(false);
  const [isHidingInputOverlay, setIsHidingInputOverlay] = useState(false);
  const [isShowingInputOverlay, setIsShowingInputOverlay] = useState(false);
  const [selected, setSelected] = useState(cities[0]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (showDropdown) {
          setIsHidingDropdownOverlay(true);
          setTimeout(() => {
            setShowDropdown(false);
            setIsHidingDropdownOverlay(false);
            setIsShowingDropdownOverlay(false);
          }, 250);
        }
      }
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        if (showInputOverlay) {
          setIsHidingInputOverlay(true);
          setTimeout(() => {
            setShowInputOverlay(false);
            setIsHidingInputOverlay(false);
            setIsShowingInputOverlay(false);
          }, 250);
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

  return (
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
      <form className={styles.searchForm}>
        <div className={styles.inputGroup}>
          <div className={
            styles.selectWrapper +
            (showDropdown ? ' ' + styles.activeSelectWrapper : showInputOverlay ? ' ' + styles.inactiveSelectWrapper : '')
          } ref={wrapperRef}>
            <div
              className={styles.selectCity}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (!showDropdown) {
                  setShowDropdown(true);
                }
              }}
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
                      setIsHidingDropdownOverlay(true);
                      setTimeout(() => {
                        setShowDropdown(false);
                        setIsHidingDropdownOverlay(false);
                        setIsShowingDropdownOverlay(false);
                      }, 250);
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
  );
};

export default HomePage;
