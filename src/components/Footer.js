function Footer(){
    return(
        <footer>
        <div className = "footer-qr row items-right">
            <img src = "https://static-basket-01.wbbasket.ru/vol0/i/v3/apps/qr-apps.svg"/>
        </div>
        <div className = "text-and-links-social-networks row between">
            <div className ="footer-text">
                    © Wildberries 2004–2024. Все права защищены.<br/>
                    Применяются <a>рекомендательные технологии </a>
                
            </div>
            <nav className="menu">
                    <ul className = "menu-list row between">
                        <li className="footer-menu-list-item">
                            <a href="https://vk.com/wildberries_shop">
                                <img className="footer-link" src="https://img.icons8.com/?size=100&id=w2mBMjvoILwt&format=png&color=FFFFFF"/>
                            </a>
                        </li>
                        <li className="footer-menu-list-item">
                            <a href="https://www.wildberries.ru/presservice#tg">
                                <img className="footer-link" src="https://img.icons8.com/?size=100&id=a7P9cxttBmHY&format=png&color=FFFFFF"/>
                            </a>
                        </li>
                        <li className="footer-menu-list-item">
                            <a href="https://www.youtube.com/@wb_online/featured">
                                <img className="footer-link" src="https://img.icons8.com/?size=100&id=I6b8QS38fpvH&format=png&color=FFFFFF"/>
                            </a>
                        </li>
                    </ul>
            </nav>
        </div>
    </footer>
    )
}

export default Footer;