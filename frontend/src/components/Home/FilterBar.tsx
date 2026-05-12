import React from 'react';
import styles from '../../styles/home.module.css';

export type FilterType = 'all' | 'today' | 'tomorrow' | 'week' | 'month' | 'custom';

interface Props {
    filter: FilterType;
    setFilter: (f: FilterType) => void;
    customFrom: string;
    customTo: string;
    setCustomFrom: (v: string) => void;
    setCustomTo: (v: string) => void;
}

export const FilterBar: React.FC<Props> = ({
                                               filter,
                                               setFilter,
                                               customFrom,
                                               customTo,
                                               setCustomFrom,
                                               setCustomTo
                                           }) => {
    const apply = (f: FilterType) => {
        setFilter(f);
        setCustomFrom('');
        setCustomTo('');
    };

    const buttons: { key: FilterType; label: string }[] = [
        {key: 'all', label: 'Все'},
        {key: 'today', label: 'Сегодня'},
        {key: 'tomorrow', label: 'Завтра'},
        {key: 'week', label: 'Неделя'},
        {key: 'month', label: 'Месяц'},
    ];

    return (
        <div className={styles.home__filters}>
            {buttons.map(({key, label}) => (
                <button
                    key={key}
                    className={filter === key ? styles.active : ''}
                    onClick={() => apply(key)}
                >
                    {label}
                </button>
            ))}

            <label>
                С:
                <input
                    type="date"
                    value={customFrom}
                    onChange={e => {
                        setCustomFrom(e.target.value);
                        setFilter('custom');
                    }}
                />
            </label>

            <label>
                По:
                <input
                    type="date"
                    value={customTo}
                    onChange={e => {
                        setCustomTo(e.target.value);
                        setFilter('custom');
                    }}
                />
            </label>
        </div>
    );
};
