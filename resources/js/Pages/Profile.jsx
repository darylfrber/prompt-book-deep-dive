import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { name } = useParams(); // Haal de naam op uit de URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useRef om te controleren of de API-aanroep al is gedaan
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return; // Voorkom dubbele API-aanroepen

        const fetchUserData = async () => {
            try {
                // Maak de API-aanroep naar de gebruikersinformatie
                const response = await axios.get(`/api/user/${name}`);
                setUser(response.data.user);
            } catch (err) {
                setError('User not found');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        hasFetched.current = true; // Markeer als opgehaald
    }, [name]);

    // Wacht tot de gegevens zijn geladen of toon een foutmelding
    if (loading) {
        return;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const formattedDate = new Date(user.created_at).toLocaleDateString('en-GB', {
        weekday: 'long', // Dagen van de week
        year: 'numeric', // Jaar
        month: 'long',   // Maand als volledige naam
        day: 'numeric'   // Dag van de maand
    });

    // Toon de gebruikersinformatie
    return (
        <main className="flex flex-col items-center gap-6 mt-16">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
                <div className="flex flex-col items-center">
                    <img src="https://via.placeholder.com/100" alt="Profile Picture"
                         className="w-24 h-24 rounded-full mb-4"/>
                    <h1 className="text-2xl font-bold text-gray-800 text-center">@{user.name}</h1>
                    <p className="text-gray-600 text-center">Joined on: {formattedDate}</p>
                </div>

                <div className="flex justify-between mt-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800">Page Views</h3>
                        <div className="flex items-center justify-center gap-2 text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M15 10l4.55-4.55a1 1 0 011.4 0l2.1 2.1a1 1 0 010 1.4L18 15m-6-2l-4.55 4.55a1 1 0 010 1.4l-2.1 2.1a1 1 0 01-1.4 0L3 18m9-9v2m0 4h.01M21 12c0 8-9 13-9 13S3 20 3 12 12 5 12 5s9 3 9 7z"/>
                            </svg>
                            <p className="text-gray-600 font-semibold">{user.page_counter}</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800">Followers</h3>
                        <div className="flex items-center justify-center gap-2 text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M7 20h10M7 16h10m-7-8a4 4 0 118 0 4 4 0 01-8 0zm4 8a6 6 0 110 12 6 6 0 010-12z"/>
                            </svg>
                            <p className="text-gray-600 font-semibold">{user.followers_count}</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800">Following</h3>
                        <div className="flex items-center justify-center gap-2 text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M17 20h5M2 20h4m8-11h.01M19 12c0 8-9 13-9 13S3 20 3 12 12 5 12 5s9 3 9 7zM12 4.34V12"/>
                            </svg>
                            <p className="text-gray-600 font-semibold">{user.following_count}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <button
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 focus:outline-none">
                        Follow
                    </button>
                </div>
            </div>

            {/* Zoekbalk */}
            <div className="mt-8 w-full max-w-lg">
                <form className="relative">
                    <input type="text" placeholder="Search AI prompts..."
                           className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    <button type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </button>
                </form>
            </div>

            <div className="w-full max-w-5xl mt-8">
                {/* Favoriete prompts en Zelf aangemaakte prompts */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Favoriete prompts */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-2">Favourite Prompts</h3>
                        <div className="flex flex-col gap-4">
                            {/* Prompt 1 */}
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm bg-white">
                                <div
                                    className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">F
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-800">Generate a startup pitch
                                        deck</h4>
                                    <p className="text-sm text-gray-600">A guide to create an effective presentation for
                                        investors.</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-800 font-semibold">Rating</p>
                                    <div className="flex items-center gap-1 text-orange-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor"
                                             viewBox="0 0 24 24">
                                            <path
                                                d="M12 .587l3.668 7.425 8.167 1.163-5.917 5.809 1.395 8.116L12 18.897l-7.313 3.844 1.395-8.116L.165 9.175l8.167-1.163L12 .587z"/>
                                        </svg>
                                        <p className="text-gray-800 font-medium">4.5</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prompt 2 */}
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm bg-white">
                                <div
                                    className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">F
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-800">AI-generated poetry</h4>
                                    <p className="text-sm text-gray-600">Generate a poem based on a selected theme and
                                        style.</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-800 font-semibold">Rating</p>
                                    <div className="flex items-center gap-1 text-orange-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor"
                                             viewBox="0 0 24 24">
                                            <path
                                                d="M12 .587l3.668 7.425 8.167 1.163-5.917 5.809 1.395 8.116L12 18.897l-7.313 3.844 1.395-8.116L.165 9.175l8.167-1.163L12 .587z"/>
                                        </svg>
                                        <p className="text-gray-800 font-medium">4.8</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zelf aangemaakte prompts */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-2">My Prompts</h3>
                        <div className="flex flex-col gap-4">
                            {/* Prompt 1 */}
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm bg-white">
                                <div
                                    className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">M
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-800">AI Content Generator</h4>
                                    <p className="text-sm text-gray-600">A tool to generate content ideas for blogs and
                                        websites.</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-800 font-semibold">Rating</p>
                                    <div className="flex items-center gap-1 text-orange-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor"
                                             viewBox="0 0 24 24">
                                            <path
                                                d="M12 .587l3.668 7.425 8.167 1.163-5.917 5.809 1.395 8.116L12 18.897l-7.313 3.844 1.395-8.116L.165 9.175l8.167-1.163L12 .587z"/>
                                        </svg>
                                        <p className="text-gray-800 font-medium">4.2</p>
                                    </div>
                                </div>
                            </div>
                            {/* Prompt 2 */}
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm bg-white">
                                <div
                                    className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">M
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-800">Quick Video Script Writer</h4>
                                    <p className="text-sm text-gray-600">Generate a video script for a given topic with
                                        an engaging structure.</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-800 font-semibold">Rating</p>
                                    <div className="flex items-center gap-1 text-orange-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor"
                                             viewBox="0 0 24 24">
                                            <path
                                                d="M12 .587l3.668 7.425 8.167 1.163-5.917 5.809 1.395 8.116L12 18.897l-7.313 3.844 1.395-8.116L.165 9.175l8.167-1.163L12 .587z"/>
                                        </svg>
                                        <p className="text-gray-800 font-medium">4.6</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Profile;
