import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
//import { Link } from "react-router-dom";

function Registration(){
  const [email, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); 
  const [isRegistered, setIsRegistered] = useState(false); // new
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isRegistered && password !== password2) {
      alert('Пароли не совпадают!');
      return;
    }

    try {
      const endpoint = isRegistered? '/customer/login':'/customer/register';
      const response = await api.post(endpoint, { email, password });

      if (response.status === 201 || response.status === 200) { 
        alert(isRegistered ? 'вход выполнен':'Регистрация прошла успешно!');

        localStorage.setItem('token', response.data.token);

        navigate('/'); // Переход на страницу входа
      } 
    }  catch (error) {
      if (error.response) {
        // Сервер ответил, но с ошибкой (например, 401)
        console.error("Ошибка сервера:", error.response.data);
        alert('Ошибка: ' + (error.response.data.error || 'Неизвестная ошибка'));
      } else if (error.request) {
        // Запрос был отправлен, но ответа не получено (нет интернета, CORS)
        console.error("Нет ответа от сервера:", error.request);
        alert('Ошибка: Сервер не отвечает');
      } else {
        // Ошибка в настройке запроса (например, неправильный URL)
        console.error("Ошибка запроса:", error.message);
        alert('Ошибка: Неправильный запрос');
      }
    }
    
  };

    return(
      <div className='register'>
        <section className="login-form">
            <h1>{isRegistered? "Вход":"Регистрация"}</h1>
            <br/>
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <input name="email" type="email" value={email} onChange={(e) => setLogin(e.target.value)} placeholder="Почта" />
                </div>

                <div className="form-item">
                    <input name="password1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
                </div>

                {!isRegistered && (
                  <div className="form-item">
                    <input name="password2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Подтвердите пароль" />
                  </div>
                )}

                <br/>
                <div className="form-item">
                    <button className="btn-login" type="submit">{isRegistered ? 'Войти' : 'Зарегистрироваться'}</button>
                </div>

                {!isRegistered && (
                  <div>
                    <div className="sign-in">
                        <div>Уже есть аккаунт? </div> 
                        <span className="" onClick={() => setIsRegistered(true)}>Войти</span>
                    </div>
                  </div>
                )}
               
            </form>
    </section>
    </div>
    )
}

export default Registration;