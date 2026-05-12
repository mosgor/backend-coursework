import React from 'react';
import styles from '../../styles/auth.module.css';

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const AuthInput: React.FC<Props> = (props) => {
    return <input className={styles.auth__input} {...props} />;
};