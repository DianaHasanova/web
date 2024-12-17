import './styles/style.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Layout from './components/Layout'; 
import Home from './components/Home'; 
import ProductInformation from './components/ProductInformation';
import Cart from './components/Cart';
import NotFound from './components/NotFound'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<Home />} /> 
          <Route path='/registration' element={<Registration />} />
          <Route path="/product/:id" element={<ProductInformation />} />
          <Route path="/cart/:id" element={<Cart />} /> 
        </Route>
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
}

export default App;
