import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts';
import styles from '../../styles/cart.module.css';
import { CartList } from '../../components/Cart/CartList.tsx';
import { CartFooter } from '../../components/Cart/CartFooter';

export const Cart: React.FC = () => {
    const { state, dispatch, actions } = useStateContext();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!state.token) {
            navigate('/login', { replace: true });
            return;
        }
        setLoading(true);
        (async () => {
            try {
                const cart = await fetchCart();
                dispatch({ type: 'SET_CART', payload: cart });
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить корзину');
            } finally {
                setLoading(false);
            }
        })();
    }, [state.token, dispatch, navigate]);

    const fetchCart = async () => {
        return await import('../../utils/api').then(({ api }) =>
            api.getCart(state.token!)
        );
    };

    const handleRemove = async (id: number) => {
        try {
            await actions.removeFromCart(id);
        } catch {
            setError('Не удалось удалить элемент');
        }
    };

    const handleCheckout = () => {
        if (state.cart.length === 0) return;
        navigate('/payment');
    };

    const total = state.cart.reduce((sum, ev) => sum + ev.price, 0);

    if (loading) return <p className={styles.cart__loading}>Загрузка корзины...</p>;
    if (error) return <p className={styles.cart__error}>{error}</p>;

    return (
        <div className={styles.cart}>
            <h2 className={styles.cart__title}>Корзина</h2>

            {state.cart.length === 0 ? (
                <p className={styles.cart__empty}>Ваша корзина пуста.</p>
            ) : (
                <>
                    <CartList items={state.cart} onRemove={handleRemove} />
                    <CartFooter total={total} onCheckout={handleCheckout} />
                </>
            )}
        </div>
    );
};
