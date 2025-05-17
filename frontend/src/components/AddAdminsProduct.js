import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function AddAdminsProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    color: '',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    const data = new FormData();
    data.append('image', file);

    try {
      const response = await api.post('/admin/upload-image', data);
      setImageUrl(response.data.url);
      console.log(response.data.url);
    } catch (error) {
      alert('Ошибка при загрузке изображения');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      alert('Пожалуйста, загрузите изображение товара');
      return;
    }

    if (!formData.name || !formData.price || !formData.color) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const payload = {
        ...formData,
        image: imageUrl,
      };

      await api.post('/admin/add-product', payload);
      alert('Товар успешно добавлен');
      setFormData({ name: '', price: '', color: '' });
      setImageUrl('');
      navigate('/products');
    } catch (error) {
      alert('Ошибка при добавлении товара');
      console.error(error);
    }
  };

  return (
    <main>
      <h2>Добавить товар (админ)</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div>
          <label>Название товара</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            required
          />
        </div>

        <div>
          <label>Цена</label>
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            step="0.01"
            required
          />
        </div>

        <div>
          <label>Цвет (HEX)</label>
          <input
            name="color"
            value={formData.color}
            onChange={handleChange}
            type="text"
            placeholder="#aabbcc"
            pattern="^#[0-9A-Fa-f]{6}$"
            title="Введите цвет в формате HEX, например #aabbcc"
            required
          />
        </div>

        <div>
          <label>Фото товара</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required={!imageUrl}
          />
          {uploading && <p>Загрузка изображения...</p>}
          {imageUrl && (
            <div>
              <p>Изображение загружено:</p>
              <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />
            </div>
          )}
        </div>

        <button type="submit" disabled={uploading}>
          Добавить товар
        </button>
      </form>
    </main>
  );
}

export default AddAdminsProduct;
