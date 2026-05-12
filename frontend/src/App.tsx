import React from 'react';
import {Routes, Route, Navigate, Link} from 'react-router-dom';
import
{
    Home,
    Login,
    Register,
    Profile,
    Tickets,
    Cart,
    Payment,
} from './pages';
import {useStateContext} from './contexts';
import styles from './app.module.css';

const App: React.FC = () => {
    const {state, dispatch} = useStateContext();
    const isAuth = Boolean(state.token);
    const handleLogout = () => dispatch({type: 'LOGOUT'});

    return (
        <div className={styles.app}>
            <header className={styles.app__header}>
                <Link to="/" className={styles.app__logo}>Evently</Link>
                <nav className={styles.app__nav}>
                    {isAuth ? (
                        <>
                            <Link to="/tickets" className={styles.app__link}>Мои билеты</Link>
                            <Link to="/cart" className={styles.app__link}>Корзина</Link>
                            <Link to="/profile" className={styles.app__link}>Профиль</Link>
                            <button onClick={handleLogout}
                                    className={`${styles.app__link} ${styles.app__linkButton}`}>Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={styles.app__link}>Вход</Link>
                            <Link to="/register" className={styles.app__link}>Регистрация</Link>
                        </>
                    )}
                </nav>
            </header>
            <main className={styles.app__content}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/event/:id" element={<Home/>}/>
                    <Route path="/login" element={isAuth ? <Navigate to="/"/> : <Login/>}/>
                    <Route path="/register" element={isAuth ? <Navigate to="/"/> : <Register/>}/>
                    <Route path="/profile" element={isAuth ? <Profile/> : <Navigate to="/login"/>}/>
                    <Route path="/tickets" element={isAuth ? <Tickets/> : <Navigate to="/login"/>}/>
                    <Route path="/cart" element={isAuth ? <Cart/> : <Navigate to="/login"/>}/>
                    <Route path="/payment" element={isAuth ? <Payment/> : <Navigate to="/login"/>}/>
                </Routes>
            </main>
        </div>
    );
};
export default App;