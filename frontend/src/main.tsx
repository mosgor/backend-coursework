import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import {StateProvider} from './contexts';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StateProvider>
            <Router>
                <App />
            </Router>
        </StateProvider>
    </StrictMode>
);
