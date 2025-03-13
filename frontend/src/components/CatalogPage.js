import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function CatalogPage() {
    const { slug } = useParams(); // Получаем slug из URL
    const [products, setProducts] = useState([]); // Состояние для хранения товаров
    const [loading, setLoading] = useState(true); // Флаг загрузки

    useEffect(() => {
        api.get(`/catalog/by-category/${slug}`) // Запрос товаров по slug
            .then(response => {
                setProducts(response.data); // Сохраняем товары в state
                setLoading(false); // Отключаем загрузку
            })
            .catch(error => {
                console.error('Ошибка при загрузке товаров:', error);
                setLoading(false); // Отключаем загрузку
            });
    }, [slug]); // Запрос заново при изменении slug

    if (loading) {
        return <p>Загрузка...</p>; // Пока запрос не завершен — показываем загрузку
    }

    return (
        <div className="catalog">
            <h2>Товары категории</h2>
            {products.length === 0 ? ( 
                <p>Нет товаров в этой категории</p> // Если товаров нет — сообщение
            ) : (
                <div className="product-list">
                    {products.map(product => (
                        <div key={product.id} className="product-item">
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.price} ₽</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CatalogPage;