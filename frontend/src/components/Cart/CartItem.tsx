import React from 'react';
import styles from '../../styles/cart.module.css';
import { Event } from '../../utils/types';

interface Props {
    item: Event;
    onRemove: (id: number) => void;
}

export const CartItem: React.FC<Props> = ({ item, onRemove }) => (
    <li className={styles.cart__item}>
        <span className={styles.cart__name}>{item.title}</span>
        <span className={styles.cart__price}>{item.price} ₽</span>
        <button
            className={styles.cart__remove}
            onClick={() => onRemove(item.id)}
        >
            ×
        </button>
    </li>
);
