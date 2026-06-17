import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ConfirmationPage.module.css';

const DOCUMENTS = [
  'Кредитный договор с Т-Банком',
  'Согласие на проверку и передачу кредитной истории для Т-Банка',
  'Согласие на хранение и передачу персональных данных для Т-Банка',
  'Заявление ЗДА для Точка Банка',
  'Согласие на передачу банковской тайны для Точка Банка',
  'Договор поручительства с Т-Банком',
];

const ACCOUNTS = [
  { id: '1', name: 'Расчётный', balance: '167 765,89 ₽', number: '**9804' },
  { id: '2', name: 'Расчётный', balance: '300 000,00 ₽', number: '**5678' },
];

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNTS[0]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    setIsSmsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      {/* 1. Верхняя навигация */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={handleBack} className={styles.iconButton} aria-label="Назад">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.headerTitle}>
          <h1>ТОЧКА БАНК</h1>
        </div>
      </header>

      <div className={styles.content}>
        {/* 2. Заголовок страницы */}
        <h1 className={styles.title}>
          Проверьте всё перед тем, как&nbsp;подключить овердрафт
        </h1>

      {/* 3. Карточка параметров подключения */}
      <div className={styles.card}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Лимит</span>
          <span className={styles.cardValue}>300 000 ₽</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Подключение</span>
          <span className={styles.cardValue}>Бесплатно</span>
        </div>
        <div>
          <p className={styles.hint}>
            Комиссии будут начисляться только при использовании лимита.
          </p>
          <button 
            className={styles.link}
            onClick={() => setIsModalOpen(true)}
          >
            Подробнее про комиссии
          </button>
        </div>
      </div>

      {/* 4. Блок выбора счёта */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>К какому счёту подключить</h2>
        <div className={styles.dropdownWrapper}>
          <button 
            className={styles.dropdownTrigger}
            onClick={() => setIsSelectOpen(!isSelectOpen)}
          >
            <div className={styles.dropdownTriggerInfo}>
              <span className={styles.dropdownTriggerLabel}>Счёт</span>
              <span className={styles.dropdownTriggerDetails}>
                {selectedAccount.balance} — {selectedAccount.name}, {selectedAccount.number}
              </span>
            </div>
            <div className={styles.dropdownTriggerActions}>
              <span className={styles.dropdownTriggerFlag} aria-label="Флаг РФ">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="5.33" fill="white" rx="1"/>
                  <rect y="5.33" width="24" height="5.33" fill="#0039A6"/>
                  <rect y="10.67" width="24" height="5.33" fill="#D52B1E" rx="1"/>
                </svg>
              </span>
              <svg 
                className={styles.dropdownTriggerChevron} 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: isSelectOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
          
          {isSelectOpen && (
            <div className={styles.dropdownList}>
              {ACCOUNTS.map(acc => (
                <div 
                  key={acc.id}
                  className={`${styles.dropdownItem} ${selectedAccount.id === acc.id ? styles.dropdownItemSelected : ''}`}
                  onClick={() => {
                    setSelectedAccount(acc);
                    setIsSelectOpen(false);
                  }}
                >
                  <div className={styles.dropdownItemFlag}>
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="5.33" fill="white" rx="1"/>
                      <rect y="5.33" width="24" height="5.33" fill="#0039A6"/>
                      <rect y="10.67" width="24" height="5.33" fill="#D52B1E" rx="1"/>
                    </svg>
                  </div>
                  <div className={styles.dropdownItemInfo}>
                    <span className={styles.dropdownItemBalance}>{acc.balance}</span>
                    <span className={styles.dropdownItemName}>{acc.name}, {acc.number}</span>
                  </div>
                  {selectedAccount.id === acc.id && (
                    <svg className={styles.dropdownItemCheck} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Блок документов */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Документы на подпись</h2>
        <div className={styles.documentList}>
          {DOCUMENTS.map((doc, index) => (
            <div key={index} className={styles.documentItem}>
              <div className={styles.documentLeftAccessory}>
                <div className={styles.documentAvatar}>
                  <div className={styles.documentAvatarContent}>
                    <div className={styles.documentAvatarFill}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect width="13.5" height="15" transform="translate(2.25 1.5)" fill="#EEEEEE"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.25 3C2.25 2.17157 2.92157 1.5 3.75 1.5H10.5L15.75 6.75V15C15.75 15.8284 15.0784 16.5 14.25 16.5H3.75C2.92157 16.5 2.25 15.8284 2.25 15V3Z" fill="#D64B33"/>
                        <path opacity="0.6" fillRule="evenodd" clipRule="evenodd" d="M10.5 1.5V5.25C10.5 6.07843 11.1716 6.75 12 6.75H15.75L10.5 1.5Z" fill="white"/>
                        <path d="M12.3904 11.8198H11.3862V13.125H10.7402V9.92578H12.5112V10.4641H11.3862V11.2837H12.3904V11.8198Z" fill="white"/>
                        <path d="M8.1958 13.125V9.92578H9.04175C9.41528 9.92578 9.71265 10.0444 9.93384 10.2817C10.1565 10.519 10.27 10.8442 10.2744 11.2573V11.7759C10.2744 12.1963 10.1631 12.5266 9.94043 12.7668C9.71924 13.0056 9.41382 13.125 9.02417 13.125H8.1958ZM8.8418 10.4641V12.5889H9.03516C9.25049 12.5889 9.4021 12.5325 9.48999 12.4197C9.57788 12.3054 9.62402 12.1091 9.62842 11.8308V11.2749C9.62842 10.9761 9.58667 10.7681 9.50317 10.6509C9.41968 10.5322 9.27759 10.47 9.0769 10.4641H8.8418Z" fill="white"/>
                        <path d="M6.27979 12V13.125H5.63379V9.92578H6.72363C7.04004 9.92578 7.29199 10.0239 7.47949 10.2202C7.66846 10.4165 7.76294 10.6714 7.76294 10.9849C7.76294 11.2983 7.66992 11.5459 7.48389 11.7275C7.29785 11.9092 7.04004 12 6.71045 12H6.27979ZM6.27979 11.4617H6.72363C6.84668 11.4617 6.94189 11.4214 7.00928 11.3408C7.07666 11.2603 7.11035 11.1431 7.11035 10.9893C7.11035 10.8296 7.07593 10.7029 7.00708 10.6091C6.93823 10.5139 6.84595 10.4656 6.73022 10.4641H6.27979V11.4617Z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <span className={styles.documentName}>{doc}</span>
            </div>
          ))}
        </div>
      </section>

        {/* 6. Основное действие */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <button className={styles.submitButton} onClick={handleSubmit}>
              Подписать и подключить
            </button>
          </div>
        </footer>

        {/* Модальное окно комиссий */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Комиссии</h3>
                <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalSection}>
                  <h4 className={styles.modalSubtitle}>Еженедельная</h4>
                  <p className={styles.modalText}>
                    Фиксированная — 490 ₽. Начисляется в следующий день после того, как вы потратите первую сумму из лимита, и дальше каждые 7 дней, пока не погасите долг.
                  </p>
                </div>
                <div className={styles.modalSection}>
                  <h4 className={styles.modalSubtitle}>Ежедневная</h4>
                  <p className={styles.modalText}>
                    Зависит от суммы долга
                  </p>
                  <div className={styles.commissionTable}>
                    <div className={styles.commissionHeader}>
                      <span className={styles.commissionHeaderTitle}>Сумма долга</span>
                      <span className={styles.commissionHeaderTitle}>Комиссия</span>
                    </div>
                    <div className={styles.commissionRow}>
                      <span className={styles.commissionAmount}>0 — 10 000 ₽</span>
                      <span className={styles.commissionFee}>0 ₽</span>
                    </div>
                    <div className={styles.commissionRow}>
                      <span className={styles.commissionAmount}>10 000,01 — 50 000 ₽</span>
                      <span className={styles.commissionFee}>180 ₽</span>
                    </div>
                    <div className={styles.commissionRow}>
                      <span className={styles.commissionAmount}>50 000,01 — 100 000 ₽</span>
                      <span className={styles.commissionFee}>320 ₽</span>
                    </div>
                    <div className={styles.commissionRow}>
                      <span className={styles.commissionAmount}>100 000,01 — 200 000 ₽</span>
                      <span className={styles.commissionFee}>460 ₽</span>
                    </div>
                    <div className={styles.commissionRow}>
                      <span className={styles.commissionAmount}>200 000,01 — 400 000 ₽</span>
                      <span className={styles.commissionFee}>590 ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно СМС-кода */}
        {isSmsModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsSmsModalOpen(false)}>
            <div className={styles.smsModalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.smsModalTopBar}>
                <button className={styles.smsCloseButton} onClick={() => setIsSmsModalOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className={styles.smsModalBody}>
                <div className={styles.smsModalHeader}>
                  <h3 className={styles.smsModalTitle}>Введите код №1</h3>
                  <p className={styles.smsModalDescription}>
                    Мы отправили пятизначный код<br />в пуш‑уведомлении или смс
                  </p>
                </div>

                <div className={styles.smsCodeInputWrapper}>
                  <input 
                    type="text" 
                    className={styles.smsCodeInput} 
                    maxLength={5}
                    value={smsCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setSmsCode(value);
                      if (value.length === 5) {
                        setIsSmsModalOpen(false);
                        setIsSuccessModalOpen(true);
                      }
                    }}
                    placeholder="— — — — —"
                  />
                </div>

            <div className={styles.smsSummaryBlock}>
              <h4 className={styles.smsSummaryTitle}>Подключение овердрафта</h4>
              <div className={styles.smsSummaryList}>
                <div className={styles.smsSummaryItem}>
                  <span className={styles.smsSummaryValue}>Лимит — 300 000 ₽</span>
                  <span className={styles.smsSummarySubtitle}>0 ₽ за подключение</span>
                </div>
                <div className={styles.smsSummaryItem}>
                  <span className={styles.smsSummaryValue}>167 765,89 ₽ — Расчётный, **9030</span>
                  <span className={styles.smsSummarySubtitle}>Подключим к этому счёту</span>
                </div>
              </div>
            </div>
            <p className={styles.smsResendText}>
              Не приходит код? <button className={styles.smsResendLink}>Отправьте ещё один</button>
            </p>
          </div>
        </div>
      </div>
        )}

        {/* Модальное окно успеха */}
        {isSuccessModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsSuccessModalOpen(false)}>
            <div className={styles.successModalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.successIconContainer}>
                <svg className={styles.successIconBg} xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <path d="M28 0C47.0909 0 56 8.90909 56 28C56 47.0909 47.0909 56 28 56C8.90909 56 0 47.0909 0 28C0 8.90909 8.90909 0 28 0Z" fill="#C9EEE3"/>
                </svg>
                <svg className={styles.successIconCheck} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M25.3318 5.40212C25.8002 4.89548 26.5904 4.86473 27.0975 5.33278C27.6037 5.80104 27.6354 6.59145 27.1678 7.0984L12.1678 23.3484C11.6864 23.8691 10.8679 23.8855 10.366 23.3845L5.36602 18.3845C4.87793 17.8964 4.87805 17.1051 5.36602 16.617C5.85418 16.1288 6.64545 16.1288 7.1336 16.617L11.2127 20.6961L25.3318 5.40212Z" fill="#3F9180"/>
                </svg>
              </div>
              <h3 className={styles.successTitle}>Документы подписаны!</h3>
              <p className={styles.successText}>
                Подключим овердрафт за 15 минут, максимум — в&nbsp;течение рабочего дня
              </p>
              <button 
                className={styles.successButton}
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate('/');
                }}
              >
                Готово
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
