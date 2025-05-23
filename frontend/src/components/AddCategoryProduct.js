import React, { useEffect, useState } from 'react';
import api from '../api';

function AddCategoryProduct({ productId }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки категорий:', error);
        setLoading(false);
      });
  }, []);

  const toggleCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      await api.post('/admin/product-categories', {
        product_id: productId,
        category_ids: selectedCategories,
      });
      alert('Категории успешно сохранены');
    } catch (error) {
      alert('Ошибка при сохранении категорий');
      console.error(error);
    }
  };

  if (loading) return <p>Загрузка категорий...</p>;

    return (
        <div>
          <h3>Выберите категории</h3>
          <div>
            {categories.map(category => (
              <label key={category.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
                <input type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
                {category.name}
              </label>
            ))}
          </div>
          <button
            className="btn-add-product"
            onClick={handleSave}
            disabled={selectedCategories.length === 0}>Сохранить категории
          </button>
        </div>
      );
      
}

export default AddCategoryProduct;
