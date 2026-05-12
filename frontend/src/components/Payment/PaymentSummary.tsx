import React from 'react';
import styles from '../../styles/payment.module.css';

interface Props {
    total: number;
}

export const PaymentSummary: React.FC<Props> = ({ total }) => (
    <div className={styles.payment__summary}>
        <p>Сумма к оплате: {total} ₽</p>
    </div>
);
