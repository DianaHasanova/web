import React from 'react';
import {Link} from 'react-router-dom';

function ProductCardMenu({ product }) {
    return (
        <div className="card">
            <Link to={`/product/${product.id}`} className='column product-container'>
                <div className="img-container">
                    <img src={product.image} alt={`фото товара ${product.name}`} />
                </div>
                <div className="info-card">
                    <div className="info-card-text">
                        <div className="prace">{product.price}</div>
                        <div>{product.name}</div>
                        <div className="score row">
                            <img src="https://img.icons8.com/?size=100&id=Ymn7DGMnEpmJ&format=png&color=FAB005" alt="Рейтинг" />
                            <div>{product.rating}</div>
                        </div>
                    </div>
                    <div className="info-card-button">
                        <button className="row">
                            <img className="logo-menu" src="https://img.icons8.com/?size=100&id=59997&format=png&color=FFFFFF" alt="Купить" />
                            <div> Купить </div>
                        </button>
                    </div>
                </div>

            </Link>
        </div>
    );
}

export default ProductCardMenu;