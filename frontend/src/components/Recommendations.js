import React, { useState, useEffect } from 'react';
import api from '../api';

function Recommendations() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/available-products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Загрузка товаров...</p>;
  }

  if (products.length === 0) {
    return <p>Товары не найдены.</p>;
  }

  return (
    <div>
      <h2>Доступные товары</h2>
      <ul>
        {products.map(item => (
          <li key={`${item.product_id}-${item.size}`}>
            <strong>{item.product.name}</strong><br />
            Размер: {item.size} <br />
            Количество в наличии: {item.stock_quantity} <br />
            Категории: {item.product.categories.join(', ')} <br />
            Стили: {item.product.styles.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;
