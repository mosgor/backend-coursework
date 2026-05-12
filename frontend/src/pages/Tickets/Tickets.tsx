import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useStateContext} from '../../contexts';
import {api} from '../../utils/api';
import {EventModal} from '../../components';
import {TicketLoader} from '../../components/Tickets/TicketsLoader';
import {TicketError} from '../../components/Tickets/TicketsError';
import {TicketEmpty} from '../../components/Tickets/TicketsEmpty';
import {TicketsGrid} from '../../components/Tickets/TicketsGrid';
import styles from '../../styles/tickets.module.css';
import {Event} from '../../utils/types';

export const Tickets: React.FC = () => {
    const {state, dispatch} = useStateContext();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Event | null>(null);

    useEffect(() => {
        if (!state.token) {
            navigate('/login', {replace: true});
            return;
        }
        setLoading(true);
        api.getTickets(state.token)
            .then(tickets => dispatch({type: 'SET_TICKETS', payload: tickets}))
            .catch(err => {
                console.error(err);
                setError('Не удалось загрузить билеты');
            })
            .finally(() => setLoading(false));
    }, [state.token, dispatch, navigate]);

    const handleDownload = (id: number) => {
        alert(`Скачивание билета ID: ${id}`);
    };

    if (loading) return <TicketLoader/>;
    if (error) return <TicketError message={error}/>;

    return (
        <div className={styles.tickets}>
            <h2 className={styles.tickets__title}>Мои билеты</h2>

            {state.tickets.length === 0 ? (
                <TicketEmpty/>
            ) : (
                <TicketsGrid
                    tickets={state.tickets}
                    onSelect={setSelected}
                />
            )}

            {selected && (
                <EventModal
                    event={selected}
                    onClose={() => setSelected(null)}
                    onDownload={handleDownload}
                />
            )}
        </div>
    );
};
