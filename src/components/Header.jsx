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
  const { user } = useContext(UserContext);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      setShowProfileModal(true);
    }
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

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
        navigate('/cart');
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
        <img src={profileIcon} alt="Профиль" className="icon" onClick={handleProfileClick} />
        <img src={cartIcon} alt="Корзина" className="icon" onClick={handleCartClick} />
      </div>

      {showProfileModal && <ProfileModal closeModal={closeProfileModal} />}

      <div className="menu-icon" onClick={toggleMobileMenu}>
        <img src={menuIcon} alt="Меню" className="icon" />
      </div>

      {showMobileMenu && (
  <div className="mobile-menu-overlay">
    <div className="mobile-links">
      <NavLink to="/" onClick={toggleMobileMenu}>Главная</NavLink>
      <NavLink to="/catalog" onClick={toggleMobileMenu}>Каталог книг</NavLink>
      <NavLink to="/contacts" onClick={toggleMobileMenu}>Контакты</NavLink>
      <NavLink to="/about" onClick={toggleMobileMenu}>О компании</NavLink>
    </div>
    <div className="mobile-icons">
      <img src={profileIcon} alt="Профиль" className="icon" onClick={handleProfileClick} />
      <img src={cartIcon} alt="Корзина" className="icon" onClick={handleCartClick} />
    </div>
  </div>
)}
    </header>
  );
}
