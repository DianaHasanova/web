import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function ProductInformation() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    api.get(`/catalog/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка при загрузке товара:', error);
        setLoading(false);
      });
  }, [id]);

  const token = localStorage.getItem('token');

  const addToLocalCart = (productToAdd, size) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItemIndex = cart.findIndex(
        item => item.id === productToAdd.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ ...productToAdd, size, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Товар добавлен в корзину!');
    } catch (err) {
      console.error('Ошибка при добавлении в локальную корзину:', err);
      alert('Ошибка при добавлении товара в корзину.');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedSize) {
      alert('Пожалуйста, выберите размер');
      return;
    }

    if (!token) {
      addToLocalCart(product, selectedSize);
    } else {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await api.post(
          `/cart/add/${product.id}`,
          { size: selectedSize },
          { headers }
        );

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

  if (loading) {
    return <main className="productinfo-main">Загрузка товара...</main>;
  }

  if (!product) {
    return <main className="productinfo-main">Товар не найден</main>;
  }

  // Пример размеров, если в данных нет — можно заменить на product.sizes
  const sizes = product.sizes || ['36', '38', '40', '42', '44', '46', '48', '50', '52'];

  return (
    <main className="productinfo-main">
      <Link to="/" className="productinfo-back-link">
        ← Вернуться в каталог
      </Link>

      <div className="productinfo-flexbox">
        <div className="productinfo-imgwrap">
            <img className="productinfo-img" src={product.image} alt={`фото товара ${product.name}`}/>
        </div>

        <div className="productinfo-details">
          <h1 className="productinfo-title">{product.name}</h1>

          <div className="productinfo-sizes-section">
            <div className="productinfo-size-table-link">Таблица размеров &gt;</div>
            
            <div className="productinfo-sizes-grid">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`productinfo-size-button ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <p className="productinfo-price">
            Цена: {product.price ? `${product.price} ₽` : 'Цена не указана'}
          </p>

          {product.colorType && product.colorType.trim() !== '' && (
            <p className="productinfo-colortype">
              Эта модель подходит людям с цветотипом: <strong>{product.colorType}</strong>
            </p>
          )}

          {product.material && (
            <p className="productinfo-material">
              Состав: <strong>{product.material}</strong>
            </p>
          )}

          <button className="btn-add-product" onClick={handleAddToCart}>
            Добавить в корзину
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductInformation;


/**
import React from 'react';
import { useParams, Link } from 'react-router-dom';
//import products from '../product.json'; 
import { useState, useEffect } from 'react';
import api from '../api';

function ProductInformation() {

    const { id } = useParams(); 
    const [product, setProducts] = useState({});
    const [selectedSize, setSelectedSize] = useState('');

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
    
    const sizes = product.sizes || ['40', '42', '44', '46', '48'];

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
 */