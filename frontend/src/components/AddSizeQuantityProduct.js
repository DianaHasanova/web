import React, { useState } from 'react';
import api from '../api';

function AddSizeQuantityProduct({ productId }) {
  // Предопределённые размеры
  const sizes = ['36', '38', '40', '42', '44', '46', '48', '50', '52', '54'];
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [quantity, setQuantity] = useState('');

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleSave = async () => {
    if (!quantity || selectedSizes.length === 0) {
      alert('Выберите размеры и укажите количество');
      return;
    }

    try {
      await api.post('/admin/product-inventory', {
        product_id: productId,
        sizes: selectedSizes,
        stock_quantity: quantity,
      });
      alert('Размеры и количество успешно сохранены');
    } catch (error) {
      alert('Ошибка при сохранении');
      console.error(error);
    }
  };

  return (
    <div className="size-quantity-block">
      <h3>Укажите размеры и количество</h3>
      <div className="size-checkbox-list">
        {sizes.map(size => (
          <label key={size} className="size-checkbox-item">
            <input
              type="checkbox"
              checked={selectedSizes.includes(size)}
              onChange={() => toggleSize(size)}
            />
            Размер {size}
          </label>
        ))}
      </div>
      <div className="form-item" style={{'marginTop':'15px'}}>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Количество"
          min="1"
        />
      </div>
      <button className="btn-add-product" onClick={handleSave}>
        Сохранить размеры и количество
      </button>
    </div>
  );
}

export default AddSizeQuantityProduct;
