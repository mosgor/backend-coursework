import React from 'react';
import styles from '../../styles/home.module.css';

interface Props {
    value: string;
    onChange: (v: string) => void;
}

export const SearchInput: React.FC<Props> = ({value, onChange}) => (
    <input
        type="text"
        placeholder="Поиск по названию..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className={styles.home__search}
    />
);
