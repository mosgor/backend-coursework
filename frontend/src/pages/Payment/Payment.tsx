import React from 'react';
import {useStateContext} from '../../contexts';
import {PaymentSummary} from '../../components/Payment/PaymentSummary';
import {PayButton} from '../../components/Payment/PayButton';
import styles from '../../styles/payment.module.css';

export const Payment: React.FC = () => {
    const {state} = useStateContext();
    const total = state.cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className={styles.payment}>
            <h2 className={styles.payment__title}>Оплата</h2>
            <PaymentSummary total={total}/>
            <PayButton total={total}/>
        </div>
    );
};