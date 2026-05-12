import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Fuse from 'fuse.js';
import {useStateContext} from '../../contexts';
import {EventModal} from '../../components';
import {api} from '../../utils/api';
import styles from '../../styles/home.module.css';

import {SearchInput} from '../../components/Home/SearchInput';
import {FilterBar} from '../../components/Home/FilterBar';
import {EventSection} from '../../components/Home/EventSection';

export const Home: React.FC = () => {
    const {state, dispatch} = useStateContext();
    const {id} = useParams();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'today' | 'tomorrow' | 'week' | 'month' | 'custom'>('all');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    useEffect(() => {
        api.getEvents().then(ev => dispatch({type: 'SET_EVENTS', payload: ev}));
    }, [dispatch]);

    const selected = id ? state.events.find(ev => ev.id.toString() === id) : null;
    useEffect(() => {
        if (id && !selected) navigate('/', {replace: true});
    }, [id, selected, navigate]);

    const fuse = useMemo(() => new Fuse(state.events, {keys: ['title'], threshold: 0.4}), [state.events]);

    const allFiltered = useMemo(() => {
        const normalize = (d: Date) => {
            d.setHours(0, 0, 0, 0);
            return d;
        };
        const today = normalize(new Date());
        let arr = state.events.map(ev => ({...ev, _date: normalize(new Date(ev.date))}));

        if (filter !== 'all') {
            let from: Date, to: Date;
            switch (filter) {
                case 'today':
                    from = today;
                    to = new Date(today.getTime() + 86400000);
                    break;
                case 'tomorrow':
                    from = new Date(today.getTime() + 86400000);
                    to = new Date(today.getTime() + 2 * 86400000);
                    break;
                case 'week':
                    from = today;
                    to = new Date(today.getTime() + 7 * 86400000);
                    break;
                case 'month':
                    from = today;
                    to = new Date(today.getTime() + 30 * 86400000);
                    break;
                case 'custom':
                    from = normalize(new Date(customFrom));
                    to = normalize(new Date(customTo));
                    break;
                default:
                    from = today;
                    to = today;
            }

            if (filter === 'custom' && customFrom && customTo) {
                arr = arr.filter(ev => ev._date >= from && ev._date <= to);
            } else if (filter !== 'custom') {
                arr = arr.filter(ev => ev._date >= from && ev._date < to);
            }
        }

        if (search.trim()) {
            const results = fuse.search(search).map(r => r.item);
            arr = arr.filter(ev => results.some(r => r.id === ev.id));
        }

        arr.sort((a, b) => a._date.getTime() - b._date.getTime());
        return arr;
    }, [state, filter, search, customFrom, customTo, fuse]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = allFiltered.filter(ev => new Date(ev.date) >= today);
    const past = allFiltered.filter(ev => new Date(ev.date) < today)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleBook = async (eventId: number) => {
        if (!state.token) {
            alert('Сначала войдите');
            return;
        }
        await api.addToCart(eventId, state.token);
        const cart = await api.getCart(state.token);
        dispatch({type: 'SET_CART', payload: cart});
        navigate('/');
    };

    return (
        <div className={styles.home}>
            <h1 className={styles.home__title}>События</h1>

            <div className={styles.home__controls}>
                <SearchInput value={search} onChange={setSearch}/>
                <FilterBar
                    filter={filter}
                    setFilter={setFilter}
                    customFrom={customFrom}
                    customTo={customTo}
                    setCustomFrom={setCustomFrom}
                    setCustomTo={setCustomTo}
                />
            </div>

            <EventSection title="Актуальные события" events={upcoming}/>
            <EventSection title="Прошедшие события" events={past} isPast/>

            {selected && (
                <EventModal
                    event={selected}
                    onClose={() => navigate('/')}
                    onBook={handleBook}
                    isPast={new Date(selected.date) < today}
                />
            )}
        </div>
    );
};
