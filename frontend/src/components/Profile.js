//import Profile from './Profile'
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    api.get('/customer/showProfile', { headers })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных профиля:', error);
      });
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <main>
      {userData ? (
      <>
        <p>Имя: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <button onClick={handleLogout}>Выйти</button>
      </>
    ) : (
      <p>Загрузка данных...</p>
    )}
    </main>
  );
}

export default Profile; 
