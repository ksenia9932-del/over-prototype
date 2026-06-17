import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PasswordPage.module.css';

const PasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setPassword(value);
    setError('');
  };

  const handleSubmit = () => {
    if (password === '12345') {
      navigate('/promo');
    } else if (password.length !== 5) {
      setError('Пароль должен состоять из 5 цифр');
    } else {
      setError('Неверный пароль');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Введите пароль, чтобы перейти к&nbsp;прототипу</h1>
        
        <div className={styles.inputWrapper}>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown}
            placeholder="•••••"
            maxLength={5}
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <button 
          className={styles.button}
          onClick={handleSubmit}
          disabled={password.length !== 5}
        >
          Перейти к&nbsp;прототипу
        </button>
      </div>
    </div>
  );
};

export default PasswordPage;
