import { Link } from 'react-router-dom';

function Header(){
    return(
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
    )
}

export default Header;