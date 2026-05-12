import React from 'react';
import styles from '../../styles/auth.module.css';

interface AuthFormProps {
    title: string;
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
    buttonText: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, children, buttonText }) => {
    return (
        <form className={styles.auth} onSubmit={onSubmit}>
            <h2 className={styles.auth__title}>{title}</h2>
            {children}
            <button className={styles.auth__button} type="submit">
                {buttonText}
            </button>
        </form>
    );
};