import React from 'react';
import styles from '../../styles/profile.module.css';

interface Props {
    type: 'success' | 'error';
    children: React.ReactNode;
}

export const ProfileMessage: React.FC<Props> = ({ type, children }) => {
    const className =
        type === 'success' ? styles.profile__success : styles.profile__error;
    return <p className={className}>{children}</p>;
};