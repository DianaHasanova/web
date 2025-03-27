import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
//import ProductCardMenu from './ProductCardMenu'; 
import api from '../api';
//import cartItems from '../customer.json';
import CartCardProduct from './CartCardProduct';


function Cart() {

    const { id } = useParams(); 
    const [cartItems, setProducts] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const headers = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        api.get('/cart/', { headers })
            .then(response => setProducts(response.data))
            .catch(error => {console.error('Ошибка:', error); console.log('Ошибка:', error)});
    }, []);

    const handleRemoveItem = (itemId) => {
        setProducts(cartItems.filter(item => item.id !== itemId));
    };

    const handleAddItem = (addedItem) => {
        setProducts(cartItems => {
            return cartItems.map(item => item.id !== addedItem.id ? item : addedItem)
        });
    };

    
    return (
        <>
            <main className=''>
                <div className='cart-title'> Корзина </div>
                <div className="product-cards row">
                    {cartItems.map(cartItem => (
                        <CartCardProduct key={cartItem.id} cartItem={cartItem}  onRemoveItem={handleRemoveItem} onAddItem={handleAddItem} /> 
                    ))}
                </div>
            </main>
        </>
    );
}

export default Cart;

/*
    const [cartIt, setProducts] = useState([]);

    useEffect(() => {
      api.get('/catalog')
        .then(response => setProducts(response.data))
        .catch(error => console.error('Ошибка:', error));
    }, []);
    */