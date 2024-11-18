import React from 'react';
import axios from 'axios';

const Logout = ({ setIsLoggedIn }) => {
    const handleLogout = async () => {
        try {
            // Stuur logout verzoek naar de server
            await axios.post('/api/logout', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Verwijder het token uit localStorage
            localStorage.removeItem('token');
            setIsLoggedIn(false);  // Zet de loginstatus naar false

            alert('Logout successful!');
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
