import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Navbar';

const Profile = () => {
    const { name } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [favouritePrompts, setFavouritePrompts] = useState([]);

    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/user/${name}`);
                setUser(response.data.user);

                const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

                if (loggedInUser?.id) {
                    // Controleer of de ingelogde gebruiker deze gebruiker volgt
                    const isFollowing = response.data.user.followers.some(
                        (follower) => follower.id === loggedInUser.id
                    );
                    setIsFollowing(isFollowing);
                }
            } catch (err) {
                setError("User not found");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [name]);


    const handleFollow = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("token");

        if (!loggedInUser?.id || !token) {
            alert("You must be logged in to follow users.");
            return;
        }

        // Controleer of de gebruiker zichzelf probeert te volgen
        if (loggedInUser.id === user.id) {
            alert("You cannot follow yourself.");
            return;
        }

        try {
            await axios.post(`/api/follow/${user.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIsFollowing(true); // Update de UI
            setUser((prevUser) => ({
                ...prevUser,
                followers_count: prevUser.followers_count + 1, // Verhoog het aantal volgers
            }));
        } catch (err) {
            alert("Error while following the user.");
            console.error(err);
        }
    };

    const handleUnfollow = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("token");

        if (!loggedInUser?.id || !token) {
            alert("You must be logged in to unfollow users.");
            return;
        }

        // Controleer of de gebruiker zichzelf probeert te ontvolgen
        if (loggedInUser.id === user.id) {
            alert("You cannot unfollow yourself.");
            return;
        }

        try {
            await axios.post(`/api/unfollow/${user.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIsFollowing(false); // Update de UI
            setUser((prevUser) => ({
                ...prevUser,
                followers_count: prevUser.followers_count - 1, // Verlaag het aantal volgers
            }));
        } catch (err) {
            alert("Error while unfollowing the user.");
            console.error(err);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const formattedDate = new Date(user.created_at).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Toon de gebruikersinformatie
    return (
        <>
            <Navbar />
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M15 10l4.55-4.55a1 1 0 011.4 0l2.1 2.1a1 1 0 010 1.4L18 15m-6-2l-4.55s 4.55a1 1 0 010 1.4l-2.1 2.1a1 1 0 01-1.4 0L3 18m9-9v2m0 4h.01M21 12c0 8-9 13-9 13S3 20 3 12 12 5 12 5s9 3 9 7z"/>
                                </svg>
                                <p className="text-gray-600 font-semibold">{user.page_counter}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Followers</h3>
                            <div className="flex items-center justify-center gap-2 text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                                     viewBox="0 0 24 24"
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M17 20h5M2 20h4m8-11h.01M19 12c0 8-9 13-9 13S3 20 3 12 12 5 12 5s9 3 9 7zM12 4.34V12"/>
                                </svg>
                                <p className="text-gray-600 font-semibold">{user.following_count}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                        {localStorage.getItem("user") ? (
                            isFollowing ? (
                                <button
                                    onClick={handleUnfollow}
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
                                >
                                    Unfollow
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 focus:outline-none"
                                >
                                    Follow
                                </button>
                            )
                        ) : (
                            <p className="text-gray-500">Log in to follow users.</p>
                        )}
                    </div>


                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
                    {/* Favourite Prompts */}
                    <div className="w-full sm:w-[500px] lg:w-[500px]">
                        <h3 className="text-md font-semibold text-gray-800 mb-2">Favourite Prompts</h3>
                        <div className="flex flex-col gap-6">
                            {favouritePrompts.length > 0 ? (
                                favouritePrompts.map((prompt) => (
                                    <Link to={`/prompt/${prompt.id}`} key={prompt.id}
                                          className="flex items-center gap-4 bg-gray-50 p-6 rounded-lg shadow-lg bg-white hover:bg-gray-100 transition-all">
                                        <div
                                            className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">F
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-800">{prompt.title}</h4>
                                            <p className="text-sm text-gray-600">{prompt.description}</p>
                                        </div>
                                        {/* Rating section */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-800 font-semibold">Rating</p>
                                            <div className="flex items-center gap-1 text-orange-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                                                     fill="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path
                                                        d="M12 .587l3.668 7.425 8.167 1.163-5.917 5.809 1.395 8.116L12 18.897l-7.313 3.844 1.395-8.116L.165 9.175l8.167-1.163L12 .587z"/>
                                                </svg>
                                                <p className="text-gray-800 font-medium">{prompt.rating || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p>No favourite prompts found.</p>
                            )}
                        </div>
                    </div>

                    {/* My Prompts */}
                    <div className="w-full sm:w-[500px] lg:w-[500px]">
                        <h3 className="text-md font-semibold text-gray-800 mb-2">My Prompts</h3>
                        <div className="flex flex-col gap-6">
                            {user.prompts.length > 0 ? (
                                user.prompts.map((prompt) => (
                                    <Link to={`/prompt/${prompt.id}`} key={prompt.id}
                                          className="flex items-center gap-4 bg-gray-50 p-6 rounded-lg shadow-lg bg-white hover:bg-gray-100 transition-all">
                                        <div
                                            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">M
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-800">{prompt.title}</h4>
                                            <p className="text-sm text-gray-600">{prompt.description}</p>
                                        </div>
                                        {/* Rating section */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-800 font-semibold">Rating</p>
                                            <div className="flex items-center gap-1 text-orange-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                                                     fill="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path
                                                        d="M12 .587l3.668 7.425 8.167 1.163-5.917 5.809 1.395 8.116L12 18.897l-7.313 3.844 1.395-8.116L.165 9.175l8.167-1.163L12 .587z"/>
                                                </svg>
                                                <p className="text-gray-800 font-medium">{prompt.rating || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p>No prompts found.</p>
                            )}
                        </div>
                    </div>
                </div>


            </main>
            <br/>
        </>
    );
};

export default Profile;
