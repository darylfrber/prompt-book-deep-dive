import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const pages = import.meta.glob('./Pages/*.{jsx,tsx}', { eager: true });

const routes = Object.keys(pages).map(filePath => {
    const fileName = filePath.replace('./Pages/', '').replace(/\.[^/.]+$/, '');
    const routePath = `/${fileName.toLowerCase()}`;

    return {
        path: routePath,
        element: React.createElement(pages[filePath].default),
    };
});

routes.unshift({
    path: '/',
    element: React.createElement(pages['./Pages/Home.tsx'].default),
});

routes.push({
    path: '*',
    element: <div>404 - Page Not Found</div>,
});

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
