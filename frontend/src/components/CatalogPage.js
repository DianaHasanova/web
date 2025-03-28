import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ProductCardMenu from "./ProductCardMenu";

function CatalogPage() {
    const { slug } = useParams(); // Получаем slug из URL
    const [сategoryData, setCategoryData] = useState([]); // Состояние для хранения товаров
    const [loading, setLoading] = useState(true); // Флаг загрузки

    useEffect(() => {
        api.get(`/catalog/by-category/${slug}`) // Запрос товаров по slug
            .then(response => {
                setCategoryData(response.data); // Сохраняем товары в state
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
            <main>
            <h2>Товары категории: {сategoryData.categoryName}</h2>
            {сategoryData.products.length === 0 ? ( 
                <p>Нет товаров в этой категории</p> 
            ) : (
                <>
                включить персонализированный поиск // сделать кнопку
                    <div className="product-cards row">
                        {сategoryData.products.map(product => (
                            <ProductCardMenu key={product.id} product={product} /> 
                        ))}
                    </div>
                </>
            )}
            </main>
        </div>
    );
}

export default CatalogPage;