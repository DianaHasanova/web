import React, { useState, useEffect } from 'react';
import AdvertisingSlide from "./AdvertisingSlide";
//import products from '../product.json'; 
import ProductCardMenu from './ProductCardMenu'; 
import api from '../api';


function Home() {
    
    const [products, setProducts] = useState([]);

    useEffect(() => {
      api.get('/catalog')
        .then(response => setProducts(response.data))
        .catch(error => console.error('Ошибка:', error));
    }, []);
    
    return (
        <>
            <AdvertisingSlide />
            <main>
                <div className="product-cards row">
                    {products.map(product => (
                        <ProductCardMenu key={product.id} product={product} /> 
                    ))}
                </div>
            </main>
        </>
    );
}

export default Home;

