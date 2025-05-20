import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { getColorType } from '../colorTypeHelper.js';

function AddAdminsProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    color: '',
    colorType: '',
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
    if (!e.target.files || e.target.files.length === 0) {
      alert('Файл не выбран');
      return;
    }

    const file = e.target.files[0];
    setUploading(true);

    const data = new FormData();
    data.append('image', file);

    try {
      const response = await api.post('/admin/upload-image', data);
      setImageUrl(response.data.url);
      setFormData(prev => ({ ...prev, color: '' })); // сброс цвета при новой загрузке
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Функция для запуска EyeDropper API
  const handlePickColor = async () => {
    if (!('EyeDropper' in window)) {
      alert('Ваш браузер не поддерживает EyeDropper API');
      return;
    }
    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const colorHex = result.sRGBHex;
     
      setFormData(prev => ({
        ...prev,
        color: colorHex,
      }));
    } catch (error) {
      // Пользователь мог отменить выбор (нажал Escape)
      console.log('Выбор цвета отменён или произошла ошибка', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      alert('Пожалуйста, загрузите изображение товара');
      return;
    }

    if (!formData.name || !formData.price) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    if (!formData.color) {
      alert('Пожалуйста, выберите цвет с изображения с помощью пипетки');
      return;
    }

    const colorType = getColorType(formData.color);
    console.log('Цвет:', formData.color, 'Цветотип:', colorType);

    try {
      const payload = {
        ...formData,
        image: imageUrl,
        colorType,
      };

      await api.post('/admin/add-product', payload);
      alert('Товар успешно добавлен');
      setFormData({ name: '', price: '', color: '' });
      setImageUrl('');
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <main className="add-product-main">
  <div className="add-product-form-container">
    <h2>Добавить товар</h2>
    <form onSubmit={handleSubmit} className="add-product-form">
      <div className="form-item">
        <label>Название товара</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          required
        />
      </div>
      <div className="form-item">
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
      <div className="form-item">
        <label>Фото товара</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required={!imageUrl}
        />
        {uploading && <p>Загрузка изображения...</p>}
        {imageUrl && (
          <div style={{ marginTop: 10 }}>
            <img src={imageUrl} alt="Товар" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
          </div>
        )}
      </div>
      <div className="form-item">
        <button type="button" className="btn-pick-color" onClick={handlePickColor}>
          Взять цвет с экрана (пипетка)
        </button>
      </div>
      {formData.color && (
        <div className="selected-color-row">
          <span>Выбранный цвет: </span>
          <span className="color-box"
            style={{ backgroundColor: formData.color 
            }}
          ></span>
          <span className="color-hex">{formData.color}</span>
        </div>
      )}
      <button type="submit" className="btn-add-product" disabled={uploading}>
        Добавить товар
      </button>
    </form>
  </div>
</main>
    
  );
}

export default AddAdminsProduct;

/**
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
          <label>Фото товара</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required={!imageUrl}
          />
          {uploading && <p>Загрузка изображения...</p>}
          {imageUrl && (
            <div style={{ marginTop: 10 }}>
              <img src={imageUrl} alt="Товар" style={{ maxWidth: '100%' }} />
            </div>
          )}
        </div>

        <div style={{ marginTop: 20 }}>
          <button type="button" onClick={handlePickColor}>
            Взять цвет с экрана (пипетка)
          </button>
        </div>

        {formData.color && (
          <div style={{ marginTop: 10 }}>
            <p>
              Выбранный цвет:{' '}
              <span
                style={{
                  display: 'inline-block',
                  width: 30,
                  height: 30,
                  backgroundColor: formData.color,
                  border: '1px solid #000',
                  verticalAlign: 'middle',
                  marginLeft: 10,
                }}
              ></span>{' '}
              {formData.color}
            </p>
          </div>
        )}

        <button type="submit" disabled={uploading} style={{ marginTop: 20 }}>
          Добавить товар
        </button>
      </form>
    </main>
 */