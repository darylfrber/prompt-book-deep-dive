import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isLogged, setIsLogged] = useState(false);
    const token = localStorage.getItem('token');

    const logout = () => {
        localStorage.removeItem('token');
        setIsLogged(false);
    };

    useEffect(() => {
        if (token) {
            setIsLogged(true);
        }
    });

    return (
        <nav className="flex justify-between items-center p-4 text-black">
            <Link to="/">
                <div className="flex items-center space-x-2">
                    <img src="https://cdn.discordapp.com/attachments/1307996765953462305/1308738172208943175/DALLE_2024-11-20_11.18.05_-_A_modern_logo_design_for_a_website_named_PromptHive._The_logo_features_a_glowing_hexagonal_hive_at_its_center_symbolizing_community_and_collaborati.webp?ex=673f08e7&is=673db767&hm=abe8fd0975bc6bb0676821ea9bdf1774c678494e3827fca002615e01b689c3f9&" alt="Logo" className="w-10 h-10" />
                    <span className="text-xl font-bold">Prompt Hive</span>
                </div>
            </Link>
            {token ? (
                <div className="flex items-center space-x-4">
                    <Link to="/prompts" className="text-lg font-semibold">Prompts</Link>
                    <Link to="/profile" className="text-lg font-semibold">Profile</Link>
                    <Link to="/" onClick={() => logout()} className="text-lg font-semibold">Logout</Link>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-lg font-semibold">Login</Link>
                    <Link to="/register" className="text-lg font-semibold">Register</Link>
                </div>
            )}

        </nav>
    )
};


// {/* <Link to="/login">
//     <button className="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded">
//         Log in!
//     </button>
// </Link> */}