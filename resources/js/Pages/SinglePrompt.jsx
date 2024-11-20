import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const SinglePrompt = () => {
    const { id } = useParams(); // Haal de ID uit de URL
    const [prompt, setPrompt] = useState(null); // Opslaan van de API-data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        // API-call naar /api/prompts/{id}
        const fetchPrompt = async () => {
            try {
                const response = await fetch(`/api/prompts/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch prompt');
                }
                const data = await response.json();
                setPrompt(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPrompt();
    }, [id]);

    if (loading) {
        return <p className="text-center mt-16 text-gray-600">Loading...</p>;
    }

    if (error) {
        return <p className="text-center mt-16 text-red-600">Error: {error}</p>;
    }

    if (!prompt) {
        return <p className="text-center mt-16 text-gray-600">Prompt not found.</p>;
    }

    return (
        <main className="flex flex-col items-center gap-6 mt-16">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 text-center">
                        {prompt.title}
                    </h1>
                    <p className="text-gray-600 text-center">{prompt.description}</p>
                </div>

                <div className="flex justify-between mb-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
                        <div className="flex items-center justify-center gap-2 text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor"
                                 viewBox="0 0 24 24">
                                <path
                                    d="M12 .587l3.668 7.425 8.167 1.163-5.917 5.809 1.395 8.116L12 18.897l-7.313 3.844 1.395-8.116L.165 9.175l8.167-1.163L12 .587z" />
                            </svg>
                            <p className="text-gray-800 font-medium">4.8</p>
                        </div>
                    </div>

                    {/* Favourites section */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800">Favourites</h3>
                        <p className="text-gray-600 font-semibold">{prompt.favourites} Favourites</p>
                    </div>

                    {/* Views section */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800">Views</h3>
                        <p className="text-gray-600 font-semibold">{prompt.views} views</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {prompt.tags && prompt.tags.length > 0 ? (
                            prompt.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-600">No tags available</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <Link
                        to={`/profile/${prompt.user.name}`}
                        className="text-orange-500 font-semibold hover:underline"
                    >
                        Author: @{prompt.user.name}
                    </Link>
                    <button
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 focus:outline-none"
                    >
                        Favourite
                    </button>
                </div>

                {/* Reviews section */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h3>
                    <div className="space-y-6">
                        {/* Dynamisch reviews tonen */}
                        {prompt.reviews && prompt.reviews.length > 0 ? (
                            prompt.reviews.map((review, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                                    <div className="flex items-center mb-2">
                                        <h4 className="font-semibold text-gray-800">{review.user.name}</h4>
                                        <p className="ml-2 text-sm text-gray-500">Rating: {review.rating}</p>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center">No reviews available.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SinglePrompt;
