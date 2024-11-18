import React from 'react';
import ReactDOM from 'react-dom/client';
import Register from './Components/Register';
import Login from './Components/Login';

const App = () => {
    return (
        <div>
            <Register />
            <Login />
        </div>
    );
};

const root = document.getElementById('app');
if (!root) {
    throw new Error('Could not find element with id "app"');
}
    ReactDOM.createRoot(root).render(<App />);
