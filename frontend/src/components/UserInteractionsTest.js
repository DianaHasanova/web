

import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCardMenu from './ProductCardMenu'; 

function UserInteractionsTest() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Пользователь не авторизован');
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    api.get('/test-recommendations', { headers })
      .then(response => {
        setProducts(response.data.recommendations || []);

        // Выводим в консоль все данные для анализа
        console.log('Взаимодействия пользователя:', response.data.userInteractions); console.log('Профиль пользователя:', response.data.userProfile); console.log('Рекомендации:', response.data.recommendations); })
      .catch(err => {
        console.error('Ошибка при загрузке рекомендаций:', err);
        alert('Ошибка при загрузке рекомендаций');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <p>Загрузка рекомендаций...</p>;
  }

  if (products.length === 0) {
    return <p>Рекомендации не найдены.</p>;
  }

  return (
    <>
      <main>
        <div className="product-cards row">
          {products.map(product => (
            <ProductCardMenu key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
}

export default UserInteractionsTest;

