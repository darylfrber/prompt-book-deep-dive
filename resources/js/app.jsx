import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Dynamisch importeren van alle .tsx en .jsx bestanden in de "Pages"-map
const pages = import.meta.glob('./Pages/*.{jsx,tsx}', { eager: true });

// Creëer de routes op basis van de bestandsnamen
const routes = Object.keys(pages).map(filePath => {
    const fileName = filePath.replace('./Pages/', '').replace(/\.[^/.]+$/, ''); // Verwijder de pad en extensie
    const routePath = `/${fileName.toLowerCase()}`; // Zorg ervoor dat het pad in kleine letters is

    return {
        path: routePath,  // Stel het pad in op basis van de bestandsnaam
        element: React.createElement(pages[filePath].default),  // Het element is de default export van de pagina
    };
});

// Voeg een route toe voor de homepage die verwijst naar de Home component
routes.unshift({
    path: '/',
    element: React.createElement(pages['./Pages/Home.tsx'].default), // Gebruik de Home component voor de root
});

// Voeg een route toe voor /profile zonder naam (404 pagina)
routes.push({
    path: '/profile', // Zorg ervoor dat /profile zonder naam naar een 404-pagina leidt
    element: <div>404 - Profile not found</div>, // 404 pagina
});

// Voeg de dynamische profielroute toe
routes.push({
    path: '/profile/:name', // Dynamische route voor profiel
    element: React.createElement(pages['./Pages/Profile.jsx'].default), // Profile component
});

// Voeg een route toe voor 404 als een pagina niet bestaat
routes.push({
    path: '*', // Dit vangt alle onbekende routes
    element: <div>404 - Page Not Found</div>, // 404 pagina voor onbekende routes
});

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
