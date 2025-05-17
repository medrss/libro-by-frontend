import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '/images/logo.png';
import profileIcon from '/images/profile.png';
import cartIcon from '/images/cart.png';
import { useState, useContext } from 'react';
import { UserContext } from "../contexts/UserContext"; 
import ProfileModal from './ProfileModal'; 
import menuIcon from '/images/menu.png';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Получаем пользователя
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
  setShowMobileMenu(!showMobileMenu);
};

  // 📌 **Открытие/закрытие модального окна профиля**
  const handleProfileClick = () => {
    if (user) {
      navigate('/profile'); // ✅ Если пользователь авторизован, переходим в профиль
    } else {
      setShowProfileModal(true); // ✅ Иначе показываем модалку входа
    }
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  // 📌 **Открытие корзины**
  const handleCartClick = async () => {
    if (!user) {
      alert("Вы должны войти в аккаунт!");
      return;
    }

    try {
      const res = await fetch('https://libro-by-backend.onrender.com/api/cart', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      const cartItems = await res.json();

      if (cartItems.length === 0) {
        alert("Корзина пустая!");
      } else {
        navigate('/cart'); // ✅ Перенаправляем на страницу корзины
      }
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
    }
  };

  return (
    <header className="header">
      <img src={logo} alt="Libro.by" className="logo" />

      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Главная</NavLink>
        <NavLink to="/catalog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Каталог книг</NavLink>
        <NavLink to="/contacts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Контакты</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>О компании</NavLink>
      </nav>

      <div className="nav-icons">
        <img
          src={profileIcon}
          alt="Профиль"
          className="icon"
          onClick={handleProfileClick} 
        />
        <img
          src={cartIcon}
          alt="Корзина"
          className="icon"
          onClick={handleCartClick} 
        />
      </div>

      {showProfileModal && <ProfileModal closeModal={closeProfileModal} />}
      <div className="menu-icon" onClick={toggleMobileMenu}>
        <img src={menuIcon} alt="Меню" className="icon" />
      </div>

      {showMobileMenu && (
  <div className="mobile-menu">
    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={toggleMobileMenu}>Главная</NavLink>
    <NavLink to="/catalog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={toggleMobileMenu}>Каталог книг</NavLink>
    <NavLink to="/contacts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={toggleMobileMenu}>Контакты</NavLink>
    <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={toggleMobileMenu}>О компании</NavLink>
  </div>
)}
    </header>
  );
}
