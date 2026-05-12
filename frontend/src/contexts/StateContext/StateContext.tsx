import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, Event } from '../../utils/types';
import { api } from '../../utils/api';

interface State {
    user: User | null;
    token: string | null;
    cart: Event[];
    tickets: Event[];
    events: Event[];
}

const initialState: State = {
    user: null,
    token: localStorage.getItem('token'),
    cart: [],
    tickets: [],
    events: []
};

type Action =
    | { type: 'LOGIN'; payload: { user: User; token: string } }
    | { type: 'LOGOUT' }
    | { type: 'SET_USER'; payload: User }
    | { type: 'SET_CART'; payload: Event[] }
    | { type: 'SET_TICKETS'; payload: Event[] }
    | { type: 'SET_EVENTS'; payload: Event[] }
    | { type: 'ADD_TO_CART'; payload: Event }
    | { type: 'REMOVE_FROM_CART'; payload: number }
    | { type: 'CLEAR_CART' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token);
            return { ...state, user: action.payload.user, token: action.payload.token };
        case 'LOGOUT':
            localStorage.removeItem('token');
            return { ...state, token: null, tickets: [], cart: [], user: null };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_CART':
            return { ...state, cart: action.payload };
        case 'SET_TICKETS':
            return { ...state, tickets: action.payload };
        case 'SET_EVENTS':
            return { ...state, events: action.payload };
        case 'ADD_TO_CART':
            return { ...state, cart: [...state.cart, action.payload] };
        case 'REMOVE_FROM_CART': {
            const idx = state.cart.findIndex(ev => ev.id === action.payload);
            if (idx < 0) return state;
            const newCart = [...state.cart];
            newCart.splice(idx, 1);
            return { ...state, cart: newCart };
        }
        case 'CLEAR_CART': {
            return {
                ...state,
                cart: []
            };
        }
        default:
            return state;
    }
}

const StateContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
    actions: {
        addToCart: (event: Event) => void;
        removeFromCart: (eventId: number) => void;
        payCart: () => Promise<void>;
    };
}>({ state: initialState, dispatch: () => {}, actions: { addToCart: () => {}, removeFromCart: () => Promise.resolve(), payCart: () => Promise.resolve() } });

export const StateProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const addToCart = async (event: Event) => {
        if (!state.token) return;
        const res = await api.addToCart(event.id, state.token);
        if (res.success) {
            dispatch({ type: 'ADD_TO_CART', payload: event });
        }
    };

    const removeFromCart = async (eventId: number) => {
        if (!state.token) return;
        const res = await api.removeFromCart(eventId, state.token);
        if (res.success) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: eventId });
        }
    };

    const payCart = async () => {
        if (!state.token) return;
        const ids = state.cart.map(ev => ev.id);
        const res = await api.pay(ids, state.token);
        if (res.success) {
            dispatch({ type: 'SET_CART', payload: [] });
            const tickets = await api.getTickets(state.token);
            dispatch({ type: 'SET_TICKETS', payload: tickets });
        }
    };

    useEffect(() => {
        if (state.token) {
            api.getUser(state.token).then(user => dispatch({ type: 'SET_USER', payload: user }));
            api.getCart(state.token).then(cart => dispatch({ type: 'SET_CART', payload: cart }));
            api.getTickets(state.token).then(t => dispatch({ type: 'SET_TICKETS', payload: t }));
            api.getEvents().then(ev => dispatch({ type: 'SET_EVENTS', payload: ev }));
        }
    }, [state.token]);

    return (
        <StateContext.Provider value={{ state, dispatch, actions: { addToCart, removeFromCart, payCart } }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);