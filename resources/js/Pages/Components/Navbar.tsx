import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isLogged, setIsLogged] = useState(false);
    const [isUser, setIsUser] = useState(null);

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    useEffect(() => {
        if (token) {
            setIsLogged(true);
        } else {
            setIsLogged(false);
        }

        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                setIsUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setIsUser(null);
            }
        }
    }, [token, user]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLogged(false);
        setIsUser(null);
    };

    return (
        <nav className="flex justify-between items-center p-4 text-black">
            <Link to="/">
                <div className="flex items-center space-x-2">
                    <img src="../../../images/logo.png" alt="Logo" className="w-10 h-10" />
                    <span className="text-xl font-bold">Prompt Hive</span>
                </div>
            </Link>
            {token ? (
                <div className="flex items-center space-x-4">
                    <Link to="/prompts" className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Prompts</Link>
                    <Link to={`/profile/${isUser ? isUser.name : ''}`} className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Profile</Link>
                    <Link to="/" onClick={() => logout()} className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Logout</Link>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Login</Link>
                    <Link to="/register" className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">Register</Link>
                </div>
            )}

        </nav>
    )
};