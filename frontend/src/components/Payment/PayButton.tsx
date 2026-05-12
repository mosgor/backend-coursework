import React from 'react';
import {useStateContext} from '../../contexts';
import styles from '../../styles/payment.module.css';

interface Props {
    total: number;
}

export const PayButton: React.FC<Props> = ({total}) => {
    const {actions, dispatch} = useStateContext();

    const handlePay = async () => {
        try {
            await actions.payCart();
            dispatch({type: 'CLEAR_CART'});
            alert(`Оплата прошла успешно! Сумма: ${total} ₽`);
        } catch (err) {
            console.error(err);
            alert('Не удалось выполнить оплату.');
        }
    };

    return (
        <button className={styles.payment__button} onClick={handlePay}>
            Оплатить
        </button>
    );
};
