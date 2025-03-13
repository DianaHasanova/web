//import categories from '../category.json'; 
import React, { useState, useEffect } from 'react';
import api from '../api';
import {useNavigate} from 'react-router-dom';

function Modal({ setOpenModal }) {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate(); 
  
    useEffect(() => {
      api.get('/category')
        .then(response => {
          setCategories(response.data); 
        })
        .catch(error => {
          console.error('Ошибка при получении категорий:', error);
          alert('Ошибка при загрузке категорий. Попробуйте позже');
        });
    }, []);

    const handleCategoryClick = (slug) => {
        setOpenModal(false); 
        navigate(`/catalog/${slug}`); 
    };
  
  return (
    <div className="modal-background">
        <div className="modal-container row">
            <div className="row items-right title-close-btn">
                <button onClick={() => {setOpenModal(false)}}>X</button>
            </div>
            <div className="title">
                <h2>Категории</h2>
            </div>
            <div className="body">
                <ul className="menu-list">
                    {categories.map((category, index) => (
                        <li key={category.id} className="menu-item row center" onClick={() => handleCategoryClick(category.slug)}>
                            <span>{category.name}</span>
                            <img src={category.image} alt={category.name} /> 
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
}

export default Modal;
