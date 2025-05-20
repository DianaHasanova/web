import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import ColorTypeTest from './ColorTypeTest';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [showColorTypeTooltip, setShowColorTypeTooltip] = useState(false);

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
    <main className="profile-main">
      {userData ? (
        <>
          <div className="profile-card rounding">
            <div className="profile-card-img">
              <img src={userData.image} alt={`Фото пользователя ${userData.name}`} />
            </div>

            <div className="profile-card-info">
              <div className="profile-info-row">
                <p className="profile-info-text" title={userData.name || '-'}>Имя: {userData.name || '-'}</p>
                <button className="profile-button-icon-edit" title="Редактировать Имя">
                  <img src="https://img.icons8.com/?size=100&id=59856&format=png&color=b8494d" alt="Редактировать" className="profile-icon-edit" />
                </button>
              </div>

              <div className="profile-info-row">
                <p className="profile-info-text" title={userData.email}>Email: {userData.email}</p>
                <button className="profile-button-icon-edit" title="Редактировать Email">
                  <img src="https://img.icons8.com/?size=100&id=59856&format=png&color=b8494d" alt="Редактировать" className="profile-icon-edit" />
                </button>
              </div>

              <div className="profile-info-row profile-color-type">
                <p className="profile-info-text" title={userData.color_type || 'Пройдите тест для определения'}>
                  Цветотип: {userData.color_type || 'Пройдите тест для определения'}
                </p>
                <div
                  className="profile-color-type-icon-container"
                  onMouseEnter={() => setShowColorTypeTooltip(true)}
                  onMouseLeave={() => setShowColorTypeTooltip(false)}
                >
                  <img
                    src="https://img.icons8.com/?size=100&id=646&format=png&color=b8494d"
                    alt="Что такое цветотип?"
                    className="profile-color-type-icon"
                  />
                  {showColorTypeTooltip && (
                    <div className="profile-color-type-tooltip">
                      Цветотип - это определение наиболее гармоничных для вас цветов в одежде.
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          </div>

          <div className="profile-test-info rounding">
            {!showTest ? (
              <span className='dashed' onClick={() => setShowTest(true)}>Пройдите небольшой тест для персонализированного поиска</span>
            ) : (
              <ColorTypeTest />
            )}
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            Выйти
          </button>
        </>
      ) : (
        <>
        <p>Загрузка данных...</p>
        <button className="btn-logout" onClick={handleLogout}>
            Выйти
          </button>
          </>
      )}
    </main>
  );
}

export default Profile;
