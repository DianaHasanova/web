import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState(null);
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
    <main>
      
      {userData ? (
      <>
        <div className="row center rounding profile-card">
            <div className='profile-card-img '>
                <img src={userData.image} alt={`фото товара ${userData.name}`} />
            </div>

            <div className='profile-card-info '>
              <div className='row '>
                <p>Имя: {userData.name?userData.name:'-'}</p> 
                  <button  className='profile-button-icon-edit' title="Редактировать Имя" >
                    <img src="https://img.icons8.com/?size=100&id=59856&format=png&color=b8494d" alt="Редактировать" className='profile-icon-edit' />
                  </button>
              </div>
              <div className='row '>
                <p>Email: {userData.email}</p> 
                  <button  className='profile-button-icon-edit' title="Редактировать Email" >
                    <img src="https://img.icons8.com/?size=100&id=59856&format=png&color=b8494d" alt="Редактировать" className='profile-icon-edit' />
                  </button>
              </div>
              <div className='row '>
                <p>Цветотип: {userData.color_type?userData.color_type:'Пройдите тест для определения'}</p> 
                  <button  className='profile-button-icon-edit' title="Редактировать Цветотип" >
                    <img src="https://img.icons8.com/?size=100&id=59856&format=png&color=b8494d" alt="Редактировать" className='profile-icon-edit' />
                  </button>
              </div>
              
              <div className='row profile-color-type'> {/* Added classname */}
        <p className='profile-color-type-text'>Цветотип: {userData.color_type ? userData.color_type : 'Пройдите тест для определения'}</p>
        <div
          className="profile-color-type-icon-container"
          onMouseEnter={() => setShowColorTypeTooltip(true)}
          onMouseLeave={() => setShowColorTypeTooltip(false)}
        >
          <img src="https://img.icons8.com/?size=100&id=646&format=png&color=b8494d" alt="Что такое цветотип?"
            className="profile-color-type-icon"/>
          {showColorTypeTooltip && (
            <div className="profile-color-type-tooltip">
              Цветотип - это определение наиболее гармоничных для вас цветов в одежде.
            </div>
          )}
        </div>
        <button className='profile-button-icon-edit' title="Редактировать Цветотип">
          <img src="https://img.icons8.com/?size=100&id=59856&format=png&color=b8494d" alt="Редактировать" className='profile-icon-edit' />
        </button>
      </div>

            </div>
        </div>
        <br/>
        <div className=" rounding profile-card">
            Пройдите небольшой тест использования персонализированного поиска
        </div>
        </>
        ) : (<p>Загрузка данных...</p>)
        }
        <br/>
        <button onClick={handleLogout}>Выйти</button>
    </main>
  );
}

export default Profile; 
/*
<div className='row '>
                <p>Имя: {userData.name?userData.name:'-'}</p> 
                  <button  title="Редактировать email" style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
                    <img src="https://img.icons8.com/?size=100&id=11737&format=png&color=b8494d" alt="Редактировать" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />
                  </button>
              </div>
<div>
              <p style={{ display: 'inline'}}>Имя: {userData.name?userData.name:'-'}</p> 
              <img src="https://img.icons8.com/?size=100&id=59856&format=png&color=b8494d" alt="Редактировать" style={{ width: '16px', display: 'inline',height: '16px', verticalAlign: 'middle' }} />
              </div>

               <p>Email: {userData.email}</p>
                <p>Цветотип: {userData.color_type?userData.color_type:'Пройдите тест для определения'}</p>

*/