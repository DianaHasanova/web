import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import Modal from './Modal';
import { useState } from 'react';

/* проверит используется где-нибудь menu-list-item */

function Header(){
    const [modalOpen, setModalOpen] = useState(false);

    return(
        <header>
            <div className='row center'>
                <div className='row header-item'>
                    <button className='row center header-icon-menu' onClick={() => {setModalOpen(true)}}> 
                        <img className="header-menu-img" style={{paddingRight:'5px', height: '14px'}} src="https://img.icons8.com/?size=100&id=120374&format=png&color=AAAAAA"/>
                        <div className="header-menu-text " style={{ color: '#b8494d' }}>Меню</div>
                    </button>
                    <input className="header-search" type="text" placeholder="Поиск товаров"/>
                </div>

                <div className='column center header-item-logo'>
                    <img src={logo} className='header-logo' alt="Логотип магазина"/>
                    <div style={{ color: '#b8494d' }}>Line & Form</div>
                </div>

                <nav className="menu header-item">
                    <ul className = "menu-list row items-right">
                        <li className="menu-list-item ">
                            <Link to="/heart">
                                <img className="header-menu-img" src="https://img.icons8.com/?size=100&id=95852&format=png&color=FFFFFF"/>
                            </Link>
                        </li>
                        <li className="menu-list-item ">
                            <Link to="/registration">
                                <img className="header-menu-img" src="https://img.icons8.com/?size=100&id=84020&format=png&color=FFFFFF"/>
                            </Link>
                        </li>
                        <li className="menu-list-item ">
                            <Link to="/">
                                <img className="header-menu-img" src="https://img.icons8.com/?size=100&id=16076&format=png&color=FFFFFF"/>
                            </Link>
                        </li>
                        <li className="menu-list-item">
                            <Link to="/cart">
                                <img className="header-menu-img" src="https://img.icons8.com/?size=100&id=59997&format=png&color=FFFFFF"/>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
            {modalOpen && <Modal setOpenModal={setModalOpen} />}
        </header>
    )
}

export default Header;

/*
<header>
        <div className="top-static-nav-menu row">
            <div className="logo">
                <img src="https://static-basket-01.wbbasket.ru/vol0/i/v3/header/logoWb.svg" alt="logo Wildberries"/>
            </div>
            <div className = "side-menu-but">
                <button className = "menu-but rounding"></button>
            </div>
            <div className="search">
                <input className="rounding" type="text" placeholder="Найти на Wildberries"/>
            </div>
            <nav className="menu">
                <ul className = "menu-list row">
                    <li className="menu-list-item ">
                        <img className="logo-menu" src="https://img.icons8.com/?size=100&id=7880&format=png&color=FFFFFF"/>
                        <Link to="/address">Адрес</Link>
                    </li>
                    <li className="menu-list-item ">
                        <img className="logo-menu" src="https://img.icons8.com/?size=100&id=84020&format=png&color=FFFFFF"/>
                        <Link to="/registration">
                            Войти
                        </Link>
                    </li>
                    <li className="menu-list-item">
                        <img className="logo-menu" src="https://img.icons8.com/?size=100&id=59997&format=png&color=FFFFFF"/>
                        <Link to="/cart">Корзина</Link>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
*/