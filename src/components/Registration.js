import { Link } from "react-router-dom";

function Registration(){
    return(
        <section className="login-form">
            <h1>Регистрация</h1>
            <br/>
            <form>
                <div className="form-item">
                    <input name="email" type="email" placeholder="Электронная почта" />
                </div>

                <div className="form-item">
                    <input name="password1" type="password" placeholder="Пароль" />
                </div>

                <div className="form-item">
                    <input name="password2" type="password" placeholder="Подтвердите пароль" />
                </div>

                <br/>
                <div className="form-item">
                    <button className="btn-login">Войти</button>
                </div>

                <div>
                    <div className="sign-in">
                        <div>Уже есть аккаунт? </div> 
                        <Link to="/...">Войти</Link>
                    </div>
                </div>
            </form>
    </section>
    )
}

export default Registration;