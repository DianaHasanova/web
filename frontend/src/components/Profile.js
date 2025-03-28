//import Profile from './Profile'
import React, { useState, useEffect } from 'react';
import api from '../api';

function Profile() {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');

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

  return (
    <main>
      {userData ? (
      <>
        <p>Имя: {userData.name}</p>
        <p>Email: {userData.email}</p>
      </>
    ) : (
      <p>Загрузка данных...</p>
    )}
    </main>
  );
}

export default Profile; 
