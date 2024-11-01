import React from 'react';
import AdvertisingSlide from "./AdvertisingSlide";
import products from '../product.json'; 
import ProductCardMenu from './ProductCardMenu'; 

function Home() {
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
