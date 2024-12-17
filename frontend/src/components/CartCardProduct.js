import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function CartCardProduct({ cartItem, onAddItem, onRemoveItem }) {

    const handleRemove = () => {
        const itemId = cartItem.id;      
        api.delete(`/cart/removal/${itemId}`)
            .then(response => {
                console.log('Товар успешно удален:', response.data);
                onRemoveItem(itemId); 
            })
            .catch(error => {
                console.error('Ошибка при удалении товара:', error);
                alert("Произошла ошибка при удалении товара. Попробуйте позже");
            });
    };

    const addProduct = () => {
        const itemId = cartItem.id; 
        api.put(`/cart/increase/${itemId}`)
        .then(response => onAddItem(response.data))
        .catch(error => {
            console.error('Ошибка при увеличении товара:', error);
            alert('Ошибка при увеличении количества товара. Попробуйте позже');
        });
    };

    const subtractProduct =() => {
        const itemId = cartItem.id;
        api.put(`/cart/subtract/${itemId}`)
        .then(response => {
            if (Object.keys(response.data).length === 0) { 
                onRemoveItem(itemId);
            } else {
                onAddItem(response.data);
            }
        })
        .catch(error => {
            console.error('Ошибка при уменьшении товара:', error);
            alert('Ошибка при уменьшении количества товара. Попробуйте позже');
        });
    };


    return (
        <>
            <div className='card-cart rounding row'>
                    <div className='card-cart-item '>
                        <img className='rounding' src={cartItem.product.image} alt={`фото товара ${cartItem.product.name} в корзине`} />
                    </div>
                    <div className='card-cart-item'>
                        {cartItem.product.name}
                    </div>
                    <div className='card-cart-item row'>
                        <button className='quantity' onClick={subtractProduct}>
                            <img src="https://img.icons8.com/?size=100&id=85458&format=png&color=FFFFFF" alt = 'уменьшить кол-во товара' />
                        </button>
                        <div>
                            {cartItem.quantity}
                        </div>
                        <button className='quantity' onClick={addProduct}>
                            <img src="https://img.icons8.com/?size=100&id=3220&format=png&color=FFFFFF" alt = 'уменьшить кол-во товара' />
                        </button>
                    </div>
                    <div className='card-cart-item'>
                        <div className=' '>
                              {cartItem.product.price} P
                        </div>
                        
                    </div>
                    <div className='card-cart-item'>
                    <button className='bin left' onClick={handleRemove}>
                            <img src="https://img.icons8.com/?size=100&id=9deX0HJ5iAFS&format=png&color=FFFFFF" alt = 'удалить товар из корзины' />
                        </button>
                    </div>
                </div>
            
        </>
    );
}

export default CartCardProduct;
