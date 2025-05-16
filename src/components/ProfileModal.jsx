import React, { useState, useContext } from 'react';
import { UserContext } from "../contexts/UserContext";
import './ProfileModal.css';
import { useNavigate } from 'react-router-dom';
import ProfileView from './ProfileView';

export default function ProfileModal({ closeModal }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { user, setUser } = useContext(UserContext); // Получаем user и setUser из контекста
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // 📌 Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Введите корректный email!");
      return;
    }
  
    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin
      ? { email, password }
      : { email, password, fullName };
  
    try {
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUser({
          fullName: data.fullName,
          role_id: data.role_id,
          token: data.token,
        });
  
        navigate('/profile');
        closeModal();
      } else {
        alert(data.message || 'Ошибка при входе/регистрации');
      }
    } catch (error) {
      console.error('Ошибка при входе/регистрации:', error);
      alert('Ошибка соединения с сервером');
    }
  };  

  if (user) {
    return <ProfileView closeModal={closeModal} />;
  }

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        <div className="profile-modal-header">
          <h2>{isLogin ? 'Вход в профиль' : 'Регистрация'}</h2>
          <button onClick={closeModal}>&#10005;</button>
        </div>
        <form className="profile-form" onSubmit={handleFormSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Полное имя"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Электронная почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={!email || !password || (!isLogin && !fullName)}>
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        <button className="toggle-mode" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}
