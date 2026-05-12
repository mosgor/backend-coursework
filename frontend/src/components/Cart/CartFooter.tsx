import React from 'react';
import styles from '../../styles/cart.module.css';

interface Props {
    total: number;
    onCheckout: () => void;
}

export const CartFooter: React.FC<Props> = ({ total, onCheckout }) => (
    <div className={styles.cart__footer}>
        <span className={styles.cart__total}>Итого: {total} ₽</span>
        <button className={styles.cart__checkout} onClick={onCheckout}>
            Оплатить
        </button>
    </div>
);
