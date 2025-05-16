import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import './ProfileView.css';
import ReaderManagement from './ReaderManagement';
import LibraryCard from './LibraryCard';
import AdminBookForm from "./AdminBookForm";
import editIcon from '../assets/icons/edit.png';

export default function ProfileView({ closeModal }) {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ fullName: '', email: '', roleId: '', profilePicture: '' });
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/profile', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        setProfile({
          fullName: data.full_name,
          email: data.email,
          roleId: Number(data.role_id),
          profilePicture: data.profile_picture
        });
        setNewFullName(data.full_name);
        setNewEmail(data.email);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };
    fetchProfile();
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ fullName: newFullName, email: newEmail })
      });
      if (response.ok) {
        alert('Профиль обновлён');
        setProfile({ ...profile, fullName: newFullName, email: newEmail });
      } else {
        const data = await response.json();
        alert(data.message || 'Ошибка обновления профиля');
      }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3000/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      if (response.ok) {
        alert('Пароль изменён');
        setOldPassword('');
        setNewPassword('');
      } else {
        const data = await response.json();
        alert(data.message || 'Ошибка смены пароля');
      }
    } catch (error) {
      console.error('Ошибка смены пароля:', error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const response = await fetch('http://localhost:3000/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({ ...prev, profilePicture: data.profilePicture }));
        alert('Аватар обновлён');
      } else {
        const data = await response.json();
        alert(data.message || 'Ошибка загрузки аватара');
      }
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const avatarSrc = profile.profilePicture
  ? `http://localhost:3000/uploads/avatars/${profile.profilePicture}`
  : '/images/avatarka.png';

  return (
    <div className="profile-view">
      <div className="profile-card">
        <div className="profile-view-header">
          <h2>Профиль</h2>
        </div>
        <div className="avatar-section">
          <div className="editable-avatar">
            <img className="avatar-img" src={avatarSrc} alt="Аватар" />
            <label htmlFor="avatar-upload" className="edit-icon">
              <img src={editIcon} alt="Редактировать" />
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="user-name">{profile.fullName}</div>
          <div className="user-email">{profile.email}</div>
        </div>
        <div className="profile-info">
          <label>ФИО</label>
          <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} />
          <label>Электронная почта</label>
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          <button className="btn" onClick={handleProfileUpdate}>Сохранить изменения</button>
        </div>
        <div className="profile-password">
          <h3>Сменить пароль</h3>
          <input type="password" placeholder="Старый пароль" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <input type="password" placeholder="Новый пароль" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button className="btn" onClick={handleChangePassword}>Изменить пароль</button>
        </div>
        <div className="logout-section">
          <button className="btn logout" onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      {profile.roleId === 3 && user && (
        <ReaderManagement token={user.token} />
      )}

      {profile.roleId === 2 && user && (
        <LibraryCard token={user.token} />
      )}

      {profile.roleId === 1 && user && (
        <AdminBookForm token={user.token} />
      )}
    </div>
  );
}
