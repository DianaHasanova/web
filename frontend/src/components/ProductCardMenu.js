import React from 'react';
import {Link} from 'react-router-dom';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function ProductCardMenu({ product }) {
    const token = localStorage.getItem('token');

    const handleAddToCart = async () => {
        if (!token) {
            alert('Авторизуйтесь, чтобы добавить товар в корзину'); 
        } else{ // убрать это else и сделать, чтобы корзина с неавторизованным пользователем работала через localStore

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await api.post(`/cart/add/${product.id}`, {}, { headers }); 

            if (response.status === 200 || response.status === 201) {
                alert('Товар добавлен в корзину!');
            } else {
                console.error('Ошибка добавления товара в корзину:', response);
                alert('Ошибка добавления товара в корзину. Попробуйте позже.');
            }
        } catch (error) {
            console.error('Ошибка добавления товара в корзину:', error);
            alert('Ошибка добавления товара в корзину. Попробуйте позже.');
        }
    }
    };

    
    const navigate = useNavigate();
    
    const handleClick = (event) => {
        if (!event.target.closest('.info-card-button')) {
                navigate(`/product/${product.id}`);
            }
    };

    return (
        <div className="card" onClick={handleClick}>
            <div to={`/product/${product.id}`} className='column product-container'>
                <div className="img-container">
                    <img src={product.image} alt={`фото товара ${product.name}`} />
                </div>
                <div className="info-card">
                    <div className="info-card-text">
                        <div className="prace">{product.price}</div>
                        <div>{product.name}</div>
                        <div className="score row">
                            <img src="https://img.icons8.com/?size=100&id=Ymn7DGMnEpmJ&format=png&color=FAB005" alt="Рейтинг" />
                            <div>{product.rating}</div>
                        </div>
                    </div>
                    <div className="info-card-button">
                        <button className="row" onClick={handleAddToCart}>
                            <img className="logo-menu" src="https://img.icons8.com/?size=100&id=59997&format=png&color=FFFFFF" alt="Корзина" />
                            <div> Купить </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCardMenu;