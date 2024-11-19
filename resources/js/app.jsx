import React from 'react';
import ReactDOM from 'react-dom/client';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';

import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/home',
        element: <Home />,
    }
]);

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
