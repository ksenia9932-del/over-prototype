import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PromoPage.module.css';

const PromoPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaqItems, setOpenFaqItems] = useState<Record<number, boolean>>({});
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [commissionModalSource, setCommissionModalSource] = useState<'promo' | 'calculator'>('promo');
  const [isCalcTooltipVisible, setIsCalcTooltipVisible] = useState(false);
  const [isWeeklyCalcTooltipVisible, setIsWeeklyCalcTooltipVisible] = useState(false);
  const [termDays, setTermDays] = useState<string>('');
  const [termDaysError, setTermDaysError] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<number | null>(null);
  const weeklyTooltipTimeoutRef = useRef<number | null>(null);

  const handleMouseEnterTooltip = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setIsCalcTooltipVisible(true);
  };

  const handleMouseLeaveTooltip = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setIsCalcTooltipVisible(false);
    }, 300); // 300ms delay
  };

  const handleMouseEnterWeeklyTooltip = () => {
    if (weeklyTooltipTimeoutRef.current) {
      clearTimeout(weeklyTooltipTimeoutRef.current);
    }
    setIsWeeklyCalcTooltipVisible(true);
  };

  const handleMouseLeaveWeeklyTooltip = () => {
    weeklyTooltipTimeoutRef.current = setTimeout(() => {
      setIsWeeklyCalcTooltipVisible(false);
    }, 300); // 300ms delay
  };

  useEffect(() => {
    if (isCalculatorModalOpen || isCommissionModalOpen || isPartnerModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCalculatorModalOpen, isCommissionModalOpen, isPartnerModalOpen]);

  const toggleFaqItem = (index: number) => {
    setOpenFaqItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleTermDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setTermDays('');
      setTermDaysError('');
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (numValue > 45) {
      setTermDays('45');
      setTermDaysError('Максимум — 45 дней, дальше уже просрочка');
    } else {
      setTermDays(numValue.toString());
      setTermDaysError('');
    }
  };

  const handleTermDaysBlur = () => {
    if (termDays !== '') {
      const numValue = parseInt(termDays, 10);
      if (numValue < 1) {
        setTermDays('1');
      }
    }
  };

  const formatAmount = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setAmount(0);
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (numValue > 300000) {
      setAmount(300000);
    } else {
      setAmount(numValue);
    }
  };

  const handleSliderChange = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    
    const newValue = Math.round(percentage * 300000);
    setAmount(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSliderChange(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleSliderChange(e.touches[0].clientX);
  };

  const getDailyRate = (amt: number) => {
    if (amt <= 10000) return 0;
    if (amt <= 50000) return 180;
    if (amt <= 100000) return 320;
    if (amt <= 200000) return 460;
    return 590;
  };

  const days = termDays === '' ? 0 : parseInt(termDays, 10);
  const validDays = isNaN(days) ? 0 : days;

  const dailyRate = getDailyRate(amount);
  const totalDailyCommission = amount > 0 ? dailyRate * validDays : 0;

  const weeklyChargesCount = (amount > 0 && validDays >= 2) ? Math.floor((validDays - 2) / 7) + 1 : 0;
  const totalWeeklyCommission = weeklyChargesCount * 490;

  const totalCommission = totalDailyCommission + totalWeeklyCommission;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleSliderChange(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleSliderChange(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.iconButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.headerTitle}>
          <h1>ТОЧКА БАНК</h1>
        </div>
      </header>

      <main className={styles.main}>
        {/* Banner and Benefits */}
        <div className={styles.topGroup}>
          <section className={styles.banner}>
            <div className={styles.bannerContent}>
            <div className={styles.bannerText}>
              <h2>Вам предодобрен овердрафт на&nbsp;300&nbsp;000&nbsp;₽</h2>
              <p>Предложение действует до 31 июля</p>
            </div>
            </div>
            <div className={styles.bannerImage}>
              <img src="./assets/images/promo-page-img.png" alt="Promo illustration" />
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <div className={styles.cardText}>
                  <h4>Дополнительный лимит к счёту</h4>
                  <p>Оплачивайте расходы, даже когда не хватает своих денег</p>
                </div>
                <div className={styles.cardImagePlaceholder}>
                  <img src="./assets/images/battery.png" alt="Дополнительный лимит" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardText}>
                  <h4>Бесплатное подключение</h4>
                  <p>Платите только, когда тратите деньги из&nbsp;овердрафта</p>
                </div>
                <div className={styles.cardImagePlaceholder}>
                  <img src="./assets/images/heart.png" alt="Бесплатное подключение" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardText}>
                  <h4>45 дней на погашение</h4>
                  <p>Можете пользоваться деньгами в течение этого срока</p>
                </div>
                <div className={styles.cardImagePlaceholder}>
                  <img src="./assets/images/calendar.png" alt="45 дней на погашение" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardText}>
                  <h4>Возобновляемый кредит</h4>
                  <p>После погашения можно брать деньги снова</p>
                </div>
                <div className={styles.cardImagePlaceholder}>
                  <img src="./assets/images/coin-machine.png" alt="Возобновляемый кредит" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* How it works */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Как работает</h3>
          <div className={styles.list}>
            <div className={styles.listItem}>
              <div className={styles.listIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M24.375 18.75C24.8928 18.75 25.3125 19.1697 25.3125 19.6875H24.375C25.3125 19.6875 25.3125 19.6904 25.3125 19.6904V19.709L25.3115 19.7217V19.7363C25.3107 19.7563 25.3089 19.7803 25.3066 19.8076C25.3021 19.8625 25.2939 19.9321 25.2793 20.0137C25.2501 20.177 25.1954 20.3897 25.0938 20.6338C24.8876 21.1284 24.4998 21.7263 23.7891 22.2949C22.3803 23.4219 19.7877 24.375 15 24.375C10.2123 24.375 7.61969 23.4219 6.21094 22.2949C5.5002 21.7263 5.11236 21.1284 4.90625 20.6338C4.80459 20.3897 4.74989 20.177 4.7207 20.0137C4.70614 19.9321 4.69794 19.8625 4.69336 19.8076C4.69108 19.7803 4.68929 19.7563 4.68848 19.7363C4.68808 19.7265 4.68766 19.717 4.6875 19.709V19.6904C4.6875 19.6904 4.6875 19.6875 5.625 19.6875H4.6875C4.6875 19.1697 5.10723 18.75 5.625 18.75C6.13198 18.75 6.54453 19.1524 6.56152 19.6553L6.5625 19.6602C6.5632 19.6655 6.56459 19.6734 6.56641 19.6836C6.57383 19.7252 6.5921 19.8059 6.63672 19.9131C6.72367 20.1216 6.92201 20.4614 7.38281 20.8301C8.31781 21.5781 10.4127 22.5 15 22.5C19.5873 22.5 21.6822 21.5781 22.6172 20.8301C23.078 20.4614 23.2763 20.1216 23.3633 19.9131C23.4079 19.8059 23.4262 19.7252 23.4336 19.6836C23.4354 19.6734 23.4368 19.6655 23.4375 19.6602L23.4385 19.6553C23.4555 19.1524 23.868 18.75 24.375 18.75ZM24.375 12.1875C24.8928 12.1875 25.3125 12.6072 25.3125 13.125H24.375C25.3125 13.125 25.3125 13.1279 25.3125 13.1279V13.1465L25.3115 13.1611V13.1738C25.3107 13.1938 25.3089 13.2178 25.3066 13.2451C25.3021 13.3 25.2939 13.3696 25.2793 13.4512C25.2501 13.6145 25.1954 13.8272 25.0938 14.0713C24.8876 14.5659 24.4998 15.1638 23.7891 15.7324C22.3803 16.8594 19.7877 17.8125 15 17.8125C10.2123 17.8125 7.61969 16.8594 6.21094 15.7324C5.5002 15.1638 5.11236 14.5659 4.90625 14.0713C4.80459 13.8272 4.74989 13.6145 4.7207 13.4512C4.70614 13.3696 4.69794 13.3 4.69336 13.2451C4.69108 13.2178 4.68929 13.1938 4.68848 13.1738C4.68808 13.164 4.68766 13.1545 4.6875 13.1465V13.1279C4.6875 13.1279 4.6875 13.125 5.625 13.125H4.6875C4.6875 12.6072 5.10723 12.1875 5.625 12.1875C6.13198 12.1875 6.54453 12.5899 6.56152 13.0928L6.5625 13.0977C6.5632 13.103 6.56459 13.1109 6.56641 13.1211C6.57383 13.1627 6.5921 13.2434 6.63672 13.3506C6.72367 13.5591 6.92201 13.8989 7.38281 14.2676C8.31781 15.0156 10.4127 15.9375 15 15.9375C19.5873 15.9375 21.6822 15.0156 22.6172 14.2676C23.078 13.8989 23.2763 13.5591 23.3633 13.3506C23.4079 13.2434 23.4262 13.1627 23.4336 13.1211C23.4354 13.1109 23.4368 13.103 23.4375 13.0977L23.4385 13.0928C23.4555 12.5899 23.868 12.1875 24.375 12.1875ZM24.375 5.625C24.8928 5.625 25.3125 6.04473 25.3125 6.5625H24.375C25.3125 6.5625 25.3125 6.56543 25.3125 6.56543V6.58398C25.3123 6.59198 25.3119 6.60147 25.3115 6.61133C25.3107 6.63132 25.3089 6.6553 25.3066 6.68262C25.3021 6.73751 25.2939 6.8071 25.2793 6.88867C25.2501 7.05204 25.1954 7.26474 25.0938 7.50879C24.8876 8.00337 24.4998 8.60133 23.7891 9.16992C22.3803 10.2969 19.7877 11.25 15 11.25C10.2123 11.25 7.61969 10.2969 6.21094 9.16992C5.5002 8.60133 5.11236 8.00337 4.90625 7.50879C4.80459 7.26474 4.74989 7.05204 4.7207 6.88867C4.70614 6.8071 4.69794 6.73751 4.69336 6.68262C4.69108 6.6553 4.68929 6.63132 4.68848 6.61133C4.68808 6.60147 4.68766 6.59198 4.6875 6.58398V6.56543C4.6875 6.56543 4.6875 6.5625 5.625 6.5625H4.6875C4.6875 6.04473 5.10723 5.625 5.625 5.625C6.13198 5.625 6.54453 6.02743 6.56152 6.53027L6.5625 6.53516C6.5632 6.54054 6.56459 6.54838 6.56641 6.55859C6.57383 6.60017 6.5921 6.68095 6.63672 6.78809C6.72367 6.99662 6.92201 7.33644 7.38281 7.70508C8.31781 8.45308 10.4127 9.375 15 9.375C19.5873 9.375 21.6822 8.45308 22.6172 7.70508C23.078 7.33644 23.2763 6.99662 23.3633 6.78809C23.4079 6.68095 23.4262 6.60017 23.4336 6.55859C23.4354 6.54838 23.4368 6.54054 23.4375 6.53516L23.4385 6.53027C23.4555 6.02743 23.868 5.625 24.375 5.625Z" fill="#191919"/>
                </svg>
              </div>
              <div className={styles.listContent}>
                <h4>Свои деньги закончились — используете овердрафт</h4>
                <p>Нужная сумма автоматически списывается из овердрафта при платеже</p>
              </div>
            </div>
            <div className={styles.listItem}>
              <div className={styles.listIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M4.02434 12.4619C4.39046 12.0958 4.9844 12.0958 5.35052 12.4619L8.16302 15.2744C8.52913 15.6405 8.52913 16.2345 8.16302 16.6006C7.7969 16.9667 7.20296 16.9667 6.83684 16.6006L5.63274 15.3965C5.83825 20.3985 9.91469 24.3749 14.8935 24.375C18.1347 24.3749 20.9924 22.6927 22.6513 20.1338C22.9329 19.6994 23.5127 19.575 23.9472 19.8564C24.3816 20.1381 24.5052 20.7189 24.2236 21.1533C22.2368 24.2178 18.8022 26.2499 14.8935 26.25C8.85704 26.2499 3.95623 21.4095 3.75677 15.3818L2.53802 16.6006C2.1719 16.9667 1.57796 16.9667 1.21184 16.6006C0.845727 16.2345 0.845727 15.6405 1.21184 15.2744L4.02434 12.4619ZM15.9374 10.3125C17.4907 10.3125 18.7499 11.5717 18.7499 13.125C18.7499 14.6783 17.4907 15.9375 15.9374 15.9375H14.0624V16.875H15.9374C16.4552 16.875 16.8749 17.2947 16.8749 17.8125C16.8749 18.3303 16.4552 18.75 15.9374 18.75H14.0624V19.2188C14.0624 19.7365 13.6427 20.1562 13.1249 20.1562C12.6072 20.1562 12.1874 19.7365 12.1874 19.2188V18.75C11.6697 18.75 11.2499 18.3303 11.2499 17.8125C11.2499 17.2947 11.6697 16.875 12.1874 16.875V15.9375C11.6697 15.9375 11.2499 15.5178 11.2499 15C11.2499 14.4822 11.6697 14.0625 12.1874 14.0625V11.4736C12.1874 10.8326 12.7075 10.3125 13.3486 10.3125H15.9374ZM15.1152 3.75C21.1476 3.75016 26.0438 8.59119 26.2431 14.6182L27.4618 13.3994C27.828 13.0333 28.4219 13.0333 28.788 13.3994C29.1541 13.7655 29.1541 14.3595 28.788 14.7256L25.9755 17.5381C25.6094 17.9042 25.0155 17.9042 24.6493 17.5381L21.8368 14.7256C21.4707 14.3595 21.4707 13.7655 21.8368 13.3994C22.203 13.0333 22.7969 13.0333 23.163 13.3994L24.3671 14.6035C24.1618 9.60079 20.0886 5.62516 15.1152 5.625C11.8679 5.62504 9.00584 7.31714 7.35052 9.88867C7.07034 10.3238 6.49088 10.4498 6.05559 10.1699C5.62022 9.88969 5.49411 9.3094 5.77434 8.87402C7.75672 5.79437 11.1976 3.75004 15.1152 3.75ZM14.0624 14.0625H15.9374C16.4552 14.0625 16.8749 13.6428 16.8749 13.125C16.8749 12.6072 16.4552 12.1875 15.9374 12.1875H14.0624V14.0625Z" fill="#191919"/>
                </svg>
              </div>
              <div className={styles.listContent}>
                <h4>Можно тратить деньги 30 дней</h4>
                <p>С момента, как потратили первую сумму. С каждым погашением лимит восстанавливается.</p>
              </div>
            </div>
            <div className={styles.listItem}>
              <div className={styles.listIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M15.9375 2.8125C21.6329 2.8125 26.25 7.42956 26.25 13.125C26.25 15.5668 25.6567 17.5307 24.1611 19.3457C23.9096 19.6509 23.4934 19.7662 23.1211 19.6328C22.7487 19.4991 22.5 19.1456 22.5 18.75V16.875C22.5 12.2151 18.7224 8.4375 14.0625 8.4375C9.4026 8.4375 5.625 12.2151 5.625 16.875C5.625 21.5349 9.4026 25.3125 14.0625 25.3125C14.946 25.3125 15.7958 25.1764 16.5938 24.9258C17.0876 24.7707 17.6143 25.0462 17.7695 25.54C17.9243 26.0337 17.6498 26.5596 17.1562 26.7148C16.1785 27.0219 15.1388 27.1875 14.0625 27.1875C8.36706 27.1875 3.75 22.5704 3.75 16.875C3.75 14.463 4.57851 12.2447 5.96582 10.4883C7.13119 6.07095 11.1525 2.8125 15.9375 2.8125ZM25.5869 20.8994C25.953 20.5333 26.547 20.5333 26.9131 20.8994C27.2792 21.2655 27.2792 21.8595 26.9131 22.2256L23.1631 25.9756C22.797 26.3417 22.203 26.3417 21.8369 25.9756L19.9619 24.1006C19.5958 23.7345 19.5958 23.1405 19.9619 22.7744C20.328 22.4083 20.922 22.4083 21.2881 22.7744L22.5 23.9873L25.5869 20.8994ZM15 12.1875C16.5533 12.1875 17.8125 13.4467 17.8125 15C17.8125 16.5533 16.5533 17.8125 15 17.8125H13.125V18.75H15C15.5178 18.75 15.9375 19.1697 15.9375 19.6875C15.9375 20.2053 15.5178 20.625 15 20.625H13.125V21.0938C13.125 21.6115 12.7053 22.0312 12.1875 22.0312C11.6697 22.0312 11.25 21.6115 11.25 21.0938V20.625C10.7322 20.625 10.3125 20.2053 10.3125 19.6875C10.3125 19.1697 10.7322 18.75 11.25 18.75V17.8125C10.7322 17.8125 10.3125 17.3928 10.3125 16.875C10.3125 16.3572 10.7322 15.9375 11.25 15.9375V13.125C11.25 12.6072 11.6697 12.1875 12.1875 12.1875H15ZM13.125 15.9375H15C15.5178 15.9375 15.9375 15.5178 15.9375 15C15.9375 14.4822 15.5178 14.0625 15 14.0625H13.125V15.9375ZM15.9375 4.6875C13.3957 4.6875 11.1156 5.81197 9.56836 7.59082C10.9267 6.93206 12.4515 6.5625 14.0625 6.5625C19.1247 6.5625 23.3343 10.2103 24.208 15.0205C24.3212 14.4389 24.375 13.8124 24.375 13.125C24.375 8.4651 20.5974 4.6875 15.9375 4.6875Z" fill="#191919"/>
                </svg>
              </div>
              <div className={styles.listContent}>
                <h4>Погасили весь долг — отсчёт начинается заново</h4>
                <p>У вас снова 30 дней, чтобы пользоваться овердрафтом</p>
              </div>
            </div>
            <div className={styles.listItem}>
              <div className={styles.listIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M17.2914 3.90704C17.7222 3.6201 18.3051 3.73708 18.5922 4.16778C18.8791 4.59839 18.7627 5.18032 18.3324 5.46759L15.936 7.06427V10.407C16.9735 10.6177 17.8878 11.1704 18.5531 11.9432L21.3783 10.3123L21.5639 7.43927C21.5975 6.92308 22.0428 6.53133 22.559 6.56427C23.0757 6.59759 23.4673 7.04371 23.434 7.56036L23.2582 10.3094L25.727 11.5311C26.191 11.7605 26.3811 12.3228 26.1518 12.7869C25.9223 13.2507 25.3609 13.4409 24.8969 13.2117L22.3158 11.9354L19.4672 13.5799C19.6093 14.0276 19.6869 14.5051 19.6869 14.9998C19.6869 15.4946 19.6093 15.972 19.4672 16.4197L22.3158 18.0643L24.8969 16.7879C25.3607 16.559 25.9222 16.7493 26.1518 17.2127C26.3812 17.6768 26.191 18.239 25.727 18.4686L23.2582 19.6902L23.434 22.4393C23.4673 22.956 23.0757 23.402 22.559 23.4354C22.0426 23.4683 21.5972 23.0769 21.5639 22.5604L21.3783 19.6883L18.5531 18.0574C17.8878 18.8302 16.9736 19.3839 15.936 19.5945V22.9354L18.3324 24.532C18.7629 24.8192 18.8791 25.4021 18.5922 25.8328C18.305 26.2634 17.7222 26.3797 17.2914 26.0926L14.9985 24.5643L12.7074 26.0926C12.2767 26.3797 11.6939 26.2633 11.4067 25.8328C11.1198 25.4021 11.2359 24.8192 11.6664 24.532L14.061 22.9354V19.5945C13.0237 19.3838 12.1109 18.8299 11.4457 18.0574L8.62053 19.6883L8.43401 22.5604C8.40069 23.0769 7.95542 23.4685 7.43889 23.4354C6.92241 23.4018 6.53057 22.9558 6.56389 22.4393L6.74065 19.6902L4.2719 18.4686C3.80776 18.2391 3.6176 17.6768 3.84709 17.2127C4.07674 16.7493 4.63818 16.5589 5.10197 16.7879L7.68303 18.0643L10.5307 16.4197C10.3886 15.972 10.3119 15.4946 10.3119 14.9998C10.312 14.5051 10.3886 14.0276 10.5307 13.5799L7.68303 11.9354L5.10197 13.2117C4.63798 13.441 4.07661 13.2508 3.84709 12.7869C3.61769 12.3228 3.8078 11.7605 4.2719 11.5311L6.74065 10.3094L6.56389 7.56036C6.53066 7.04387 6.92244 6.59779 7.43889 6.56427C7.9552 6.53118 8.40037 6.92302 8.43401 7.43927L8.62053 10.3123L11.4457 11.9432C12.1109 11.1707 13.0238 10.6178 14.061 10.407V7.06427L11.6664 5.46759C11.236 5.18032 11.1196 4.59845 11.4067 4.16778C11.6938 3.73701 12.2766 3.61991 12.7074 3.90704L14.9985 5.43536L17.2914 3.90704ZM14.9994 12.1873C13.4464 12.1875 12.1871 13.4468 12.1869 14.9998C12.1869 16.553 13.4463 17.8122 14.9994 17.8123C16.5525 17.8121 17.8119 16.553 17.8119 14.9998C17.8117 13.4468 16.5524 12.1876 14.9994 12.1873Z" fill="#191919"/>
                </svg>
              </div>
              <div className={styles.listContent}>
                <h4>Не погасили долг за 30 дней — ещё 15 дней на погашение</h4>
                <p>Тратить деньги в этот период не получится, только возвращать. Дальше просрочка и штрафы.</p>
              </div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoBoxHeader}>
                <div className={styles.infoBoxIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M8.50999 2.25813C9.08428 1.39309 10.6236 1.84785 10.4602 2.8343L9.49143 7.20051H13.3489C14.1544 7.20062 14.6594 7.94969 14.26 8.55207L9.48948 15.7425C8.91505 16.6074 7.37565 16.1519 7.53928 15.1654L8.50999 10.8001H4.65061C3.84528 10.7999 3.34033 10.0509 3.73948 9.44856L8.50999 2.25813Z" fill="#835DE1"/>
                  </svg>
                </div>
                <div className={styles.infoBoxContent}>
                  <h4 className={styles.infoBoxTitle}>Мы предупредим о первом списании и напомним о сроках</h4>
                  <p className={styles.infoBoxText}>Вы сразу узнаете, что вышли в овердрафт, и не забудете вовремя погасить долг</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Сколько стоит</h3>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingLeft}>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M17.9596 2.29537C18.7829 1.44087 20.2087 2.21047 19.9459 3.36764L17.9684 12.0678L23.3053 14.1206C23.5982 14.2333 23.8151 14.4852 23.8834 14.7915C23.9515 15.0981 23.862 15.4196 23.6442 15.646L12.0406 27.6958C11.2174 28.5503 9.79152 27.7807 10.0543 26.6235L12.0309 17.9233L6.69493 15.8706C6.40173 15.7578 6.18401 15.5053 6.11583 15.1987C6.04785 14.8921 6.13822 14.5714 6.35607 14.3452L17.9596 2.29537ZM8.68712 14.6284L13.4615 16.4643C13.8961 16.6315 14.1424 17.0923 14.0397 17.5463L12.442 24.5756L21.3131 15.3628L16.5387 13.5268C16.1039 13.3596 15.8575 12.898 15.9606 12.4438L17.5582 5.41549L8.68712 14.6284Z" fill="#191919"/>
                    </svg>
                  </div>
                  <div className={styles.listContent}>
                    <h4>Подключение — 0 ₽</h4>
                    <p>Вы платите, только когда тратите деньги из овердрафта</p>
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M15 3.75C21.2132 3.75 26.25 8.7868 26.25 15C26.25 21.2132 21.2132 26.25 15 26.25C8.7868 26.25 3.75 21.2132 3.75 15C3.75 8.7868 8.7868 3.75 15 3.75ZM15 5.625C9.82233 5.625 5.625 9.82233 5.625 15C5.625 20.1777 9.82233 24.375 15 24.375C20.1777 24.375 24.375 20.1777 24.375 15C24.375 9.82233 20.1777 5.625 15 5.625ZM16.2803 19.6875H14.5645V12.2627H12.8066V11.1797C14.0721 11.039 14.677 10.4343 14.916 9.84375H16.2803V19.6875Z" fill="#191919"/>
                    </svg>
                  </div>
                  <div className={styles.listContent}>
                    <h4>Ежедневная комиссия — от 180 ₽</h4>
                    <p>
                      Зависит от суммы долга — <span className={styles.tooltipLink} onClick={() => { setIsCommissionModalOpen(true); setCommissionModalSource('promo'); }} style={{ cursor: 'pointer' }}>размер комиссии</span>
                    </p>
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M15 3.75C21.2132 3.75 26.25 8.7868 26.25 15C26.25 21.2132 21.2132 26.25 15 26.25C8.7868 26.25 3.75 21.2132 3.75 15C3.75 8.7868 8.7868 3.75 15 3.75ZM15 5.625C9.82233 5.625 5.625 9.82233 5.625 15C5.625 20.1777 9.82233 24.375 15 24.375C20.1777 24.375 24.375 20.1777 24.375 15C24.375 9.82233 20.1777 5.625 15 5.625ZM14.8848 9.64648C16.9094 9.64668 18.245 10.983 18.2451 12.7266C18.245 15.609 14.6878 16.0311 13.5625 18.0557H18.1885V19.6875H11.4668C11.4668 15.2016 16.4873 15.1166 16.4873 12.7822C16.487 11.9107 15.8543 11.2784 14.8281 11.2783C13.4118 11.2784 12.9886 12.607 12.9863 12.6143L11.6084 11.9531C11.6146 11.9307 12.254 9.64648 14.8848 9.64648Z" fill="#191919"/>
                    </svg>
                  </div>
                  <div className={styles.listContent}>
                    <h4>Еженедельная комиссия — 490 ₽</h4>
                    <p>Начисляется в следующий день после того, как вы потратите первую сумму, и дальше каждые 7 дней, пока не погасите долг</p>
                  </div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M14.0312 5.27185C15.1076 3.91766 16.5482 3.41201 17.7822 3.97107C18.9774 4.51259 19.5383 5.87638 19.1904 7.26013L18.0283 11.9066C18.0373 11.9107 18.0489 11.9147 18.0625 11.9193C18.112 11.9361 18.1852 11.9506 18.2812 11.9506H21.7969C23.1791 11.9506 24.3284 12.3851 25.126 13.2367C25.9138 14.0779 26.25 15.2112 26.25 16.4056C26.2499 16.8029 26.1539 17.3272 26.0439 17.8207C25.9286 18.3382 25.7768 18.9084 25.6279 19.432C25.4786 19.9571 25.3292 20.4452 25.2178 20.8011C25.1621 20.9791 25.1167 21.1254 25.084 21.2269L25.0449 21.3451L25.042 21.3539C25.0356 21.3787 25.0263 21.4119 25.0146 21.4525C24.9914 21.5337 24.9575 21.646 24.9102 21.7777C24.8165 22.0382 24.666 22.3938 24.4424 22.7572C24.0071 23.4644 23.1718 24.3763 21.7969 24.3763H12.1875C10.1165 24.3763 8.43762 22.6973 8.4375 20.6263V13.2093C8.43755 12.7973 8.57371 12.3968 8.82422 12.0697L14.0264 5.27868L14.0312 5.27185ZM5.625 11.7201C6.14277 11.7201 6.5625 12.1398 6.5625 12.6576V23.2045C6.56239 23.7221 6.1427 24.142 5.625 24.142C5.1073 24.142 4.68761 23.7221 4.6875 23.2045V12.6576C4.6875 12.1398 5.10723 11.7201 5.625 11.7201ZM17.0088 5.6781C16.8102 5.58813 16.238 5.51338 15.5049 6.432L10.3125 13.2093V20.6263C10.3126 21.6618 11.152 22.5013 12.1875 22.5013H21.7969C22.2232 22.5013 22.5594 22.2398 22.8457 21.7748C22.9826 21.5524 23.0812 21.3219 23.1455 21.1429C23.1769 21.0555 23.1985 20.9838 23.2119 20.9369C23.2185 20.9138 23.2232 20.8965 23.2256 20.8871L23.2275 20.8793C23.2338 20.8529 23.2425 20.8259 23.251 20.8002V20.7982L23.2539 20.7914L23.2627 20.7631L23.2988 20.6517C23.3302 20.5546 23.3757 20.4131 23.4297 20.2406C23.5379 19.8951 23.6817 19.4238 23.8252 18.9193C23.9692 18.413 24.1105 17.8814 24.2148 17.4134C24.3244 16.9221 24.3749 16.5764 24.375 16.4056C24.375 15.5487 24.1355 14.9232 23.7568 14.5189C23.388 14.1251 22.7801 13.8256 21.7969 13.8256H18.2812C17.7384 13.8256 17.1567 13.6663 16.7217 13.2631C16.2519 12.8272 16.0565 12.1981 16.1904 11.5316C16.1933 11.5174 16.1967 11.5027 16.2002 11.4886L17.3721 6.80407C17.5364 6.15112 17.2462 5.78569 17.0088 5.6781Z" fill="#191919"/>
                    </svg>
                  </div>
                  <div className={styles.listContent}>
                    <h4>Комиссии не начислятся</h4>
                    <p>Если вернуть деньги в тот же день до 21:00 мск</p>
                  </div>
                </div>
              </div>
              <div className={styles.linkItem} onClick={() => setIsCalculatorModalOpen(true)}>
                <div className={styles.linkIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M18.75 3.75C20.8211 3.75 22.5 5.42893 22.5 7.5V22.5C22.5 24.5711 20.8211 26.25 18.75 26.25H7.5C5.42893 26.25 3.75 24.5711 3.75 22.5V7.5C3.75 5.42893 5.42893 3.75 7.5 3.75H18.75ZM7.5 5.625C6.46447 5.625 5.625 6.46447 5.625 7.5V22.5C5.625 23.5355 6.46447 24.375 7.5 24.375H18.75C19.7855 24.375 20.625 23.5355 20.625 22.5V7.5C20.625 6.46447 19.7855 5.625 18.75 5.625H7.5ZM25.3125 6.5625C25.8303 6.5625 26.25 6.98223 26.25 7.5V22.5C26.25 23.0178 25.8303 23.4375 25.3125 23.4375C24.7947 23.4375 24.375 23.0178 24.375 22.5V7.5C24.375 6.98223 24.7947 6.5625 25.3125 6.5625ZM9.375 20.625C9.89277 20.625 10.3125 21.0447 10.3125 21.5625C10.3125 22.0803 9.89277 22.5 9.375 22.5C8.85723 22.5 8.4375 22.0803 8.4375 21.5625C8.4375 21.0447 8.85723 20.625 9.375 20.625ZM13.125 20.625C13.6428 20.625 14.0625 21.0447 14.0625 21.5625C14.0625 22.0803 13.6428 22.5 13.125 22.5C12.6072 22.5 12.1875 22.0803 12.1875 21.5625C12.1875 21.0447 12.6072 20.625 13.125 20.625ZM16.875 20.625C17.3928 20.625 17.8125 21.0447 17.8125 21.5625C17.8125 22.0803 17.3928 22.5 16.875 22.5C16.3572 22.5 15.9375 22.0803 15.9375 21.5625C15.9375 21.0447 16.3572 20.625 16.875 20.625ZM9.375 16.875C9.89277 16.875 10.3125 17.2947 10.3125 17.8125C10.3125 18.3303 9.89277 18.75 9.375 18.75C8.85723 18.75 8.4375 18.3303 8.4375 17.8125C8.4375 17.2947 8.85723 16.875 9.375 16.875ZM13.125 16.875C13.6428 16.875 14.0625 17.2947 14.0625 17.8125C14.0625 18.3303 13.6428 18.75 13.125 18.75C12.6072 18.75 12.1875 18.3303 12.1875 17.8125C12.1875 17.2947 12.6072 16.875 13.125 16.875ZM16.875 16.875C17.3928 16.875 17.8125 17.2947 17.8125 17.8125C17.8125 18.3303 17.3928 18.75 16.875 18.75C16.3572 18.75 15.9375 18.3303 15.9375 17.8125C15.9375 17.2947 16.3572 16.875 16.875 16.875ZM16.875 7.5C17.9105 7.5 18.75 8.33947 18.75 9.375V12.1875C18.75 13.223 17.9105 14.0625 16.875 14.0625H9.375C8.33947 14.0625 7.5 13.223 7.5 12.1875V9.375C7.5 8.33947 8.33947 7.5 9.375 7.5H16.875ZM9.375 12.1875H16.875V9.375H9.375V12.1875Z" fill="#835DE1"/>
                  </svg>
                </div>
                <div className={styles.linkContent}>
                  <h4>Калькулятор комиссий</h4>
                  <p>Посчитайте стоимость овердрафта</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Частые вопросы</h3>
          <div className={styles.accordion}>
            <div className={styles.accordionItemContainer}>
              <div className={styles.accordionItem} onClick={() => toggleFaqItem(0)}>
                <span>На что можно тратить?</span>
                <svg className={openFaqItems[0] ? styles.chevronOpen : ''} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {openFaqItems[0] && (
                <div className={styles.accordionContent}>
                  <p style={{ fontWeight: 500 }}>Можно</p>
                  <ul>
                    <li>Перевести деньги физлицам</li>
                    <li>Перевести на свой счёт в Точка Банке</li>
                    <li>Заплатить контрагентам</li>
                    <li>Оплатить услуги — например, доставку или уборку в офисе</li>
                    <li>Оплатить услуги Точка Банка</li>
                    <li>Уплатить налоги, таможенные платежи и страховые взносы своей организации</li>
                    <li>Оплатить аренду и коммунальные услуги</li>
                    <li>Выплатить зарплаты, командировочные</li>
                    <li>Купить что‑то для бизнеса: канцтовары, бензин или новый стол</li>
                  </ul>
                  <p style={{ fontWeight: 500, marginTop: '20px' }}>Нельзя</p>
                  <ul>
                    <li>Оплачивать кредиты и услуги другого банка</li>
                    <li>Покупать ценные бумаги</li>
                    <li>Оплачивать блокировки и аресты налоговых и судебных органов</li>
                  </ul>
                </div>
              )}
            </div>

            <div className={styles.accordionItemContainer}>
              <div className={styles.accordionItem} onClick={() => toggleFaqItem(1)}>
                <span>Можно ли изменить лимит?</span>
                <svg className={openFaqItems[1] ? styles.chevronOpen : ''} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {openFaqItems[1] && (
                <div className={styles.accordionContent}>
                  <p>Лимит рассчитывается автоматически и зависит от вашего оборота по счёту, кредитной истории и других бизнес-факторов. Поэтому он может увеличиваться или уменьшаться после подключения. Если это случится — обязательно сообщим. Изменить лимит самостоятельно или через поддержку не получится.</p>
                </div>
              )}
            </div>

            <div className={styles.accordionItemContainer}>
              <div className={styles.accordionItem} onClick={() => toggleFaqItem(2)}>
                <span>Как снимать наличные?</span>
                <svg className={openFaqItems[2] ? styles.chevronOpen : ''} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {openFaqItems[2] && (
                <div className={styles.accordionContent}>
                  <p>Можно перевести деньги на другой счёт или себе как физлицу и снять наличные оттуда. А со счёта, к которому подключён овердрафт, снимать наличные нельзя.</p>
                </div>
              )}
            </div>

            <div className={styles.accordionItemContainer}>
              <div className={styles.accordionItem} onClick={() => toggleFaqItem(3)}>
                <span>Как погасить долг?</span>
                <svg className={openFaqItems[3] ? styles.chevronOpen : ''} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {openFaqItems[3] && (
                <div className={styles.accordionContent}>
                  <p>Он погашается автоматически, как только на счёт с подключённым овердрафтом приходят деньги. Сначала погашаются комиссии, затем — основной долг.</p>
                </div>
              )}
            </div>

            <div className={styles.accordionItemContainer}>
              <div className={styles.accordionItem} onClick={() => toggleFaqItem(4)}>
                <span>Что будет при просрочке?</span>
                <svg className={openFaqItems[4] ? styles.chevronOpen : ''} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {openFaqItems[4] && (
                <div className={styles.accordionContent}>
                  <p>Если не погасить долг за 45 дней, в первый день просрочки и дальше каждые 7 дней будет начисляться штраф: 2% от суммы долга + 990 ₽. Комиссии в период просрочки не начисляются.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className={styles.actions}>
          <div className={styles.actionItem} onClick={() => setIsPartnerModalOpen(true)}>
            <div className={styles.actionIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.actionContent}>
              <h4>О партнёре</h4>
              <p>Кредит выдаёт наш партнёр Т-Банк, а сервис и заботливая поддержка — на стороне Точка Банка</p>
            </div>
          </div>
          <div className={`${styles.actionItem} ${styles.actionItemDanger}`}>
            <div className={styles.actionIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M4.93 4.93L19.07 19.07" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className={styles.actionContent}>
              <h4>Отказаться от предложения</h4>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <button 
          className={styles.primaryButton}
          onClick={() => navigate('/confirmation')}
        >
          К подписанию документов
        </button>
      </footer>

      {/* Commission Rates Modal */}
      {isCommissionModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCommissionModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalNavigationBar} style={{ justifyContent: commissionModalSource === 'calculator' ? 'space-between' : 'flex-end' }}>
                {commissionModalSource === 'calculator' && (
                  <button 
                    className={styles.modalCloseButton} 
                    onClick={() => {
                      setIsCommissionModalOpen(false);
                      setIsCalculatorModalOpen(true);
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <button className={styles.modalCloseButton} onClick={() => setIsCommissionModalOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className={styles.modalTitleContainer}>
                <h3>Ежедневная комиссия</h3>
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.commissionTable}>
                <div className={styles.commissionTableHeader}>
                  <div className={styles.commissionTableColLeft}>Сумма долга</div>
                  <div className={styles.commissionTableColRight}>Комиссия</div>
                </div>
                <div className={styles.commissionTableRow}>
                  <div className={styles.commissionTableColLeft}>0 — 10 000 ₽</div>
                  <div className={styles.commissionTableColRight}>0 ₽</div>
                </div>
                <div className={styles.commissionTableRow}>
                  <div className={styles.commissionTableColLeft}>10 000,01 — 50 000 ₽</div>
                  <div className={styles.commissionTableColRight}>180 ₽</div>
                </div>
                <div className={styles.commissionTableRow}>
                  <div className={styles.commissionTableColLeft}>50 000,01 — 100 000 ₽</div>
                  <div className={styles.commissionTableColRight}>320 ₽</div>
                </div>
                <div className={styles.commissionTableRow}>
                  <div className={styles.commissionTableColLeft}>100 000,01 — 200 000 ₽</div>
                  <div className={styles.commissionTableColRight}>460 ₽</div>
                </div>
                <div className={styles.commissionTableRow}>
                  <div className={styles.commissionTableColLeft}>200 000,01 — 400 000 ₽</div>
                  <div className={styles.commissionTableColRight}>590 ₽</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Modal */}
      {isPartnerModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPartnerModalOpen(false)}>
          <div className={styles.modalContentPartner} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalNavigationBar}>
                <button className={styles.modalCloseButton} onClick={() => setIsPartnerModalOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.partnerLogo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none">
                  <rect width="72" height="72" fill="#FFDD2D"/>
                  <path d="M35.9998 19.5H55.4998V39.0656C55.4998 44.0829 52.825 48.7085 48.4668 51.2264L36.0092 58.4073L23.5516 51.2264C19.1934 48.7271 16.5186 44.0829 16.5186 39.0656L16.5186 19.5H35.9998Z" fill="white"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M27.1973 29.7961V35.8766C28.039 34.944 29.5541 34.3098 31.275 34.3098H33.1642V41.3788C33.1642 43.2626 32.6591 44.904 31.8922 45.8179H40.085C39.3181 44.904 38.8131 43.2626 38.8131 41.3788V34.3098H40.7023C42.4419 34.3098 43.957 34.944 44.78 35.8766V29.7961H27.1973Z" fill="#333333"/>
                </svg>
              </div>
              <h3 className={styles.partnerTitle}>Т-Банк</h3>
              <p className={styles.partnerDescription}>
                Онлайн-экосистема, основанная на финансовых и лайфстайл-услугах. Клиентами Т‑Банка стали 44 000 000 человек по всей России.
              </p>
              <p className={styles.partnerDescription}>
                Кредит выдаёт АО «ТБанк» на основании универсальной лицензии ЦБ РФ № 2673.
              </p>
              <div className={styles.partnerLink}>
                <div className={styles.partnerLinkIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M14.0391 4.6875C14.5567 4.6877 14.9766 5.10736 14.9766 5.625C14.9766 6.14264 14.5567 6.5623 14.0391 6.5625H9.375C7.8217 6.5625 6.5625 7.8217 6.5625 9.375V20.625C6.5625 22.1783 7.8217 23.4375 9.375 23.4375H20.625C22.1783 23.4375 23.4375 22.1783 23.4375 20.625V16.4062C23.4375 15.8885 23.8572 15.4688 24.375 15.4688C24.8928 15.4688 25.3125 15.8885 25.3125 16.4062V20.625C25.3125 23.2138 23.2138 25.3125 20.625 25.3125H9.375C6.78617 25.3125 4.6875 23.2138 4.6875 20.625V9.375C4.6875 6.78617 6.78616 4.6875 9.375 4.6875H14.0391ZM24.375 4.6875C24.8928 4.68752 25.3125 5.10724 25.3125 5.625V10.3125C25.3125 10.8303 24.8928 11.25 24.375 11.25C23.8572 11.25 23.4375 10.8303 23.4375 10.3125V7.96777L15.6602 15.667C15.2923 16.0309 14.6982 16.0276 14.334 15.6602C13.9699 15.2923 13.9732 14.6983 14.3408 14.334L22.1924 6.5625H19.6875C19.1697 6.56248 18.75 6.14276 18.75 5.625C18.75 5.10724 19.1697 4.68752 19.6875 4.6875H24.375Z" fill="#191919"/>
                  </svg>
                </div>
                <div className={styles.partnerLinkText}>tbank.ru</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {isCalculatorModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCalculatorModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalNavigationBar}>
                <button className={styles.modalCloseButton} onClick={() => setIsCalculatorModalOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className={styles.modalTitleContainer}>
                <h3>Калькулятор комиссий</h3>
              </div>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalSubtitle}>Комиссии начисляются только при&nbsp;использовании лимита</p>
              
              <div className={styles.calcInputLayout}>
                <div className={styles.calcInputContent}>
                  <div className={styles.calcInputText}>
                    <div className={styles.calcInputTitle}>Срок долга</div>
                    <input 
                      type="text" 
                      className={styles.calcInputField} 
                      placeholder="от 1 до 45 дней"
                      value={termDays}
                      onChange={handleTermDaysChange}
                      onBlur={handleTermDaysBlur}
                    />
                  </div>
                </div>
                {termDaysError && (
                  <>
                    <div className={styles.calcInputDivider}></div>
                    <div className={styles.calcInputError}>
                      {termDaysError}
                    </div>
                  </>
                )}
              </div>

              <div className={styles.calcSliderLayout}>
                <div className={styles.calcSliderContent}>
                  <div className={styles.calcSliderDescription}>
                    <div className={styles.calcSliderText}>
                      <div className={styles.calcSliderTitle}>Сумма долга</div>
                      <input 
                        type="text" 
                        className={styles.calcInputField} 
                        value={amount === 0 ? '' : formatAmount(amount).replace(' ₽', '')}
                        onChange={handleAmountChange}
                        placeholder="0"
                        style={{ padding: 0, height: 'auto' }}
                      />
                    </div>
                    <div 
                      className={styles.calcSliderControl}
                      ref={sliderRef}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.calcSliderTrack}>
                        <div className={styles.calcSliderTrackFill} style={{ width: `${(amount / 300000) * 100}%` }}></div>
                        <div className={styles.calcSliderGrip} style={{ left: `${(amount / 300000) * 100}%` }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" fill="white" stroke="#835DE1" strokeWidth="2"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className={styles.calcSliderLabels}>
                      <div className={styles.calcSliderLabelLeft}>0 ₽</div>
                      <div className={styles.calcSliderLabelRight}>до 300 000 ₽</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.calcSummary}>
                <div className={styles.calcSummaryLine}>
                  <div className={styles.calcSummaryLeft}>
                    <span className={styles.calcSummaryLabel}>Ежедневная комиссия</span>
                    <div 
                      className={styles.tooltipContainer}
                      onMouseEnter={handleMouseEnterTooltip}
                      onMouseLeave={handleMouseLeaveTooltip}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1ZM10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM9.95215 12.7764C10.144 12.7764 10.3 12.8445 10.4199 12.9805C10.5397 13.1084 10.5995 13.256 10.5996 13.4238C10.5996 13.5918 10.5398 13.7439 10.4199 13.8799C10.3 14.0078 10.144 14.0722 9.95215 14.0723C9.7602 14.0723 9.60436 14.0078 9.48438 13.8799C9.36438 13.7439 9.30371 13.5918 9.30371 13.4238C9.30378 13.2559 9.36444 13.1084 9.48438 12.9805C9.60437 12.8445 9.76016 12.7764 9.95215 12.7764ZM9.97559 5.36035C10.2956 5.36035 10.596 5.40791 10.876 5.50391C11.164 5.59191 11.4121 5.72811 11.6201 5.91211C11.8281 6.08809 11.9923 6.30831 12.1123 6.57227C12.2402 6.83609 12.3037 7.13597 12.3037 7.47168C12.3037 7.72768 12.2757 7.95253 12.2197 8.14453C12.1637 8.33635 12.0834 8.50827 11.9795 8.66016C11.8835 8.81207 11.7678 8.95214 11.6318 9.08008C11.4959 9.20003 11.3521 9.3242 11.2002 9.45215C11.0322 9.58815 10.8876 9.71222 10.7676 9.82422C10.6557 9.93615 10.5641 10.0567 10.4922 10.1846C10.4203 10.3044 10.3679 10.44 10.3359 10.5918C10.3039 10.7438 10.2881 10.9285 10.2881 11.1445V11.6963H9.44824V10.9766C9.44824 10.7447 9.47157 10.5402 9.51953 10.3643C9.57553 10.1883 9.64833 10.0278 9.73633 9.88379C9.83222 9.74 9.936 9.60813 10.0479 9.48828C10.1679 9.36828 10.2882 9.25634 10.4082 9.15234L10.7441 8.85254C10.9441 8.69254 11.1083 8.5078 11.2363 8.2998C11.3721 8.09196 11.4394 7.83213 11.4395 7.52051C11.4395 7.07267 11.2919 6.72455 10.9961 6.47656C10.7081 6.22856 10.3555 6.10449 9.93945 6.10449C9.50767 6.10459 9.15569 6.2361 8.88379 6.5C8.61985 6.76395 8.45563 7.09993 8.3916 7.50781L7.57617 7.36426C7.69614 6.74042 7.96779 6.25237 8.3916 5.90039C8.82352 5.54046 9.35174 5.36042 9.97559 5.36035Z" fill="#676767"/>
                      </svg>
                      {isCalcTooltipVisible && (
                        <div className={styles.tooltip} style={{ textAlign: 'center' }}>
                          Зависит от суммы долга — <br />
                          <a 
                            href="#" 
                            className={styles.tooltipLink}
                            onClick={(e) => {
                              e.preventDefault();
                              setIsCommissionModalOpen(true);
                              setCommissionModalSource('calculator');
                              setIsCalculatorModalOpen(false);
                            }}
                          >
                            размер комиссии
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={styles.calcSummaryValue}>{formatAmount(totalDailyCommission)}</span>
                </div>
                <div className={styles.calcSummaryLine}>
                  <div className={styles.calcSummaryLeft}>
                    <span className={styles.calcSummaryLabel}>Еженедельная комиссия</span>
                    <div 
                      className={styles.tooltipContainer}
                      onMouseEnter={handleMouseEnterWeeklyTooltip}
                      onMouseLeave={handleMouseLeaveWeeklyTooltip}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1ZM10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM9.95215 12.7764C10.144 12.7764 10.3 12.8445 10.4199 12.9805C10.5397 13.1084 10.5995 13.256 10.5996 13.4238C10.5996 13.5918 10.5398 13.7439 10.4199 13.8799C10.3 14.0078 10.144 14.0722 9.95215 14.0723C9.7602 14.0723 9.60436 14.0078 9.48438 13.8799C9.36438 13.7439 9.30371 13.5918 9.30371 13.4238C9.30378 13.2559 9.36444 13.1084 9.48438 12.9805C9.60437 12.8445 9.76016 12.7764 9.95215 12.7764ZM9.97559 5.36035C10.2956 5.36035 10.596 5.40791 10.876 5.50391C11.164 5.59191 11.4121 5.72811 11.6201 5.91211C11.8281 6.08809 11.9923 6.30831 12.1123 6.57227C12.2402 6.83609 12.3037 7.13597 12.3037 7.47168C12.3037 7.72768 12.2757 7.95253 12.2197 8.14453C12.1637 8.33635 12.0834 8.50827 11.9795 8.66016C11.8835 8.81207 11.7678 8.95214 11.6318 9.08008C11.4959 9.20003 11.3521 9.3242 11.2002 9.45215C11.0322 9.58815 10.8876 9.71222 10.7676 9.82422C10.6557 9.93615 10.5641 10.0567 10.4922 10.1846C10.4203 10.3044 10.3679 10.44 10.3359 10.5918C10.3039 10.7438 10.2881 10.9285 10.2881 11.1445V11.6963H9.44824V10.9766C9.44824 10.7447 9.47157 10.5402 9.51953 10.3643C9.57553 10.1883 9.64833 10.0278 9.73633 9.88379C9.83222 9.74 9.936 9.60813 10.0479 9.48828C10.1679 9.36828 10.2882 9.25634 10.4082 9.15234L10.7441 8.85254C10.9441 8.69254 11.1083 8.5078 11.2363 8.2998C11.3721 8.09196 11.4394 7.83213 11.4395 7.52051C11.4395 7.07267 11.2919 6.72455 10.9961 6.47656C10.7081 6.22856 10.3555 6.10449 9.93945 6.10449C9.50767 6.10459 9.15569 6.2361 8.88379 6.5C8.61985 6.76395 8.45563 7.09993 8.3916 7.50781L7.57617 7.36426C7.69614 6.74042 7.96779 6.25237 8.3916 5.90039C8.82352 5.54046 9.35174 5.36042 9.97559 5.36035Z" fill="#676767"/>
                      </svg>
                      {isWeeklyCalcTooltipVisible && (
                        <div className={styles.tooltip} style={{ whiteSpace: 'normal', width: '100%', minWidth: '240px', textAlign: 'center' }}>
                          Фиксированная — 490 ₽. Начисляется в следующий день после того, как вы потратите первую сумму из лимита, и дальше каждые 7 дней, пока не погасите долг.
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={styles.calcSummaryValue}>{formatAmount(totalWeeklyCommission)}</span>
                </div>

                <div className={styles.calcSummaryTotal}>
                  <div className={styles.calcSummaryDivider}></div>
                  <div className={styles.calcSummaryTotalContent}>
                    <span className={styles.calcSummaryTotalLabel}>Итого</span>
                    <span className={styles.calcSummaryTotalValue}>{formatAmount(totalCommission)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoPage;
