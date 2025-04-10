import React from 'react';
import { useParams, Link } from 'react-router-dom';
//import products from '../product.json'; 
import { useState, useEffect } from 'react';
import api from '../api';

function ProductInformation() {

    const { id } = useParams(); 
    const [product, setProducts] = useState({});

    useEffect(() => {
      api.get('/catalog/' + id)
        .then(response => setProducts(response.data))
        .catch(error => console.error('Ошибка:', error));
    }, []);

    const token = localStorage.getItem('token');

    const handleAddToCart = async () => {
        if (!token) {
            alert('Авторизуйтесь, чтобы добавить товар в корзину'); 
        } else{ // убрать это else и сделать, чтобы корзина с неавторизованным пользователем работала через localStore

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await api.post(`/cart/add/${product.id}`, {}, { headers }); 

            if (response.status === 200 || response.status === 201) {
                alert('Товар добавлен в корзину!');
            } else {
                console.error('Ошибка добавления товара в корзину:', response);
                alert('Ошибка добавления товара в корзину. Попробуйте позже.');
            }
        } catch (error) {
            console.error('Ошибка добавления товара в корзину:', error);
            alert('Ошибка добавления товара в корзину. Попробуйте позже.');
        }
    }
    };
    

    return (
        <main className="product-card">
            <Link className="go-back" to="/">
                <img src="https://img.icons8.com/?size=100&id=39776&format=png&color=1A1A1A" alt="кнопка вернуться назад"/>
            </Link>
            <div className="">
                <div className = "product-card-info row">
                    <div className="product-card-info-photo">
                        <img src={product.image} alt={`фото товара ${product.name}`} />
                    </div>
                    <div className = "product-card-info-text">
                        <div className="product-card-info-text-name product-card-info-text-item">
                            Маска для волос с кератином увлажняющая восстанавливающая
                        </div>
                        <div className = "score row product-card-info-text-item">
                            <img src="https://img.icons8.com/?size=100&id=Ymn7DGMnEpmJ&format=png&color=FAB005" alt=''/>
                            <div>{product.rating}</div>
                        </div>
                        <div className="prace product-card-info-text-item">{product.price}</div>
                        <div className = "table-characteristic product-card-info-text-item">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Артикул</td>
                                        <td>148825454</td>
                                    </tr>
                                    <tr>
                                        <td>Состав</td>
                                        <td>aqua; argania spinosa kernel oil; prunus armeniaca (apricot) kernel extract; cetearyl alcohol; keratin</td>
                                    </tr>
                                    <tr>
                                        <td>Количество предметов в упаковке</td>
                                        <td>маска для волос</td>
                                    </tr>
                                    <tr>
                                        <td>Действие</td>
                                        <td>питание, укрепление, восстановление</td>
                                    </tr>
                                    <tr>
                                        <td>Объем товара</td>
                                        <td>350 мл</td>
                                    </tr>
                                    <tr>
                                        <td>Назначение маски</td>
                                        <td>для окрашенных волос; для кудрявых волос; для всех типов волос</td>
                                    </tr>
                                    <tr>
                                        <td>Срок годности</td>
                                        <td>36 месяцев (3 года)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="info-card-button product-card-info-text-item">
                            <button className = "" onClick={handleAddToCart}>
                                <div> Добавить в корзину </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    </main>
    )
}

export default ProductInformation;
