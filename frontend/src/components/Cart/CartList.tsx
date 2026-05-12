import React from 'react';
import styles from '../../styles/cart.module.css';
import { Event } from '../../utils/types';
import { CartItem } from './CartItem';

interface Props {
    items: Event[];
    onRemove: (id: number) => void;
}

export const CartList: React.FC<Props> = ({ items, onRemove }) => (
    <ul className={styles.cart__list}>
        {items.map(item => (
            <CartItem key={item.id} item={item} onRemove={onRemove} />
        ))}
    </ul>
);
