import React, { useEffect, useState } from 'react';
import api from '../api';

function AddStyleProduct({ productId }) {
  const [styles, setStyles] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/styles')
      .then(response => {
        setStyles(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки стилей:', error);
        setLoading(false);
      });
  }, []);

  const toggleStyle = (id) => {
    setSelectedStyles(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
        const response = await api.post('/admin/product-style', {
          product_id: productId,
          style_ids: selectedStyles,
        });
        console.log('Ответ сервера:', response.data);
      } catch (error) {
        console.error('Ошибка при сохранении стилей:', error);
      }
  };

  if (loading) return <p>Загрузка стилей...</p>;

  return (
    <div>
      <h3>Выберите стили для товара</h3>
      <div>
        {styles.map(style => (
          <label key={style.id} style={{  display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selectedStyles.includes(style.id)}
              onChange={() => toggleStyle(style.id)}
            />
            {style.name}
          </label>
        ))}
      </div>
      <button className="btn-add-product" onClick={handleSave} disabled={selectedStyles.length === 0}>
        Сохранить стили
      </button>
    </div>
  );
}

export default AddStyleProduct;

/**
 <div>
      <h3>Выберите стили для товара</h3>
      <div>
        {styles.map(style => (
          <label key={style.id} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={selectedStyles.includes(style.id)}
              onChange={() => toggleStyle(style.id)}
            />
            {style.name}
          </label>
        ))}
      </div>
      <button onClick={handleSave} disabled={selectedStyles.length === 0}>
        Сохранить стили
      </button>
    </div>
 */