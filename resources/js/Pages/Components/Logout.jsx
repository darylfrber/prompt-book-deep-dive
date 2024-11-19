import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importeer useNavigate

const Logout = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();  // Maak de navigate functie beschikbaar

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Verwijder het token uit localStorage
            localStorage.removeItem('token');
            setIsLoggedIn(false);

            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
            Logout
        </button>
    );
};

export default Logout;
