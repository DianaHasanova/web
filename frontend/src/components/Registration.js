import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function Registration(){
  const [name, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert('Пароли не совпадают!');
      return;
    }

    try {
      const response = await api.post('/customer/register', { name, password });

      if (response.status === 201) { 
        alert('Регистрация прошла успешно!');
        navigate('/'); // Переход на страницу входа
      } else {
        console.error("Ошибка при регистрации:", response.status, response.data);
        alert('Ошибка при регистрации. Попробуйте позже.');
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      alert('Ошибка при регистрации. Попробуйте позже.');
    }
  };

    return(
        <section className="login-form">
            <h1>Регистрация</h1>
            <br/>
            <form onSubmit={handleSubmit}>
                <div className="form-item">
                    <input name="name" type="text" value={name} onChange={(e) => setLogin(e.target.value)} placeholder="Логин" />
                </div>

                <div className="form-item">
                    <input name="password1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
                </div>

                <div className="form-item">
                    <input name="password2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Подтвердите пароль" />
                </div>

                <br/>
                <div className="form-item">
                    <button className="btn-login" type="submit">Зарегистрироваться</button>
                </div>

                <div>
                    <div className="sign-in">
                        <div>Уже есть аккаунт? </div> 
                        <Link to="/...">Войти</Link>
                    </div>
                </div>
            </form>
    </section>
    )
}

export default Registration;