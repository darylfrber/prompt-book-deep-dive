import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Components/Navbar';

const SinglePrompt = () => {
    const { id } = useParams(); // Haal de ID uit de URL
    const [prompt, setPrompt] = useState(null); // Opslaan van de API-data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [reviewText, setReviewText] = useState(""); // Opslaan van review tekst
    const [reviewRating, setReviewRating] = useState(0); // Opslaan van review rating
    const [submitted, setSubmitted] = useState(false); // Om te controleren of review is ingediend
    const [isFavourite, setIsFavourite] = useState(false); // State voor favoriet status

    const hasFetched = useRef(false); // useRef om te voorkomen dat de API-call meerdere keren wordt uitgevoerd

    useEffect(() => {
        if (hasFetched.current) return; // Voorkom dubbele API-aanroep

        const fetchPrompt = async () => {
            try {
                const response = await fetch(`/api/prompts/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch prompt');
                }
                const data = await response.json();
                setPrompt(data);

                // Haal de gebruiker uit de localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    const favourites = user.favourites || [];  // Zorg ervoor dat favourites altijd een array is
                    setIsFavourite(favourites.includes(data.id)); // Zet isFavourite op basis van of de prompt in favourites staat
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPrompt();
        hasFetched.current = true; // Markeer als opgehaald
    }, [id]);


    const handleFavourite = async () => {
        // Haal de gebruiker en token op uit de localStorage
        const user = JSON.parse(localStorage.getItem("user")); // Pas eventueel de key aan
        const token = localStorage.getItem("token");

        if (!user || !token) {
            alert("You must be logged in to favourite this item.");
            return;
        }

        try {
            // Haal de huidige favorieten en check of de prompt al favoriet is
            const updatedFavourites = [...user.favourites];
            const isAlreadyFavourite = updatedFavourites.includes(prompt.id);

            if (isAlreadyFavourite) {
                // Als al favoriet, verwijder de prompt uit de lijst
                const index = updatedFavourites.indexOf(prompt.id);
                updatedFavourites.splice(index, 1);
            } else {
                // Als niet favoriet, voeg de prompt toe aan de lijst
                updatedFavourites.push(prompt.id);
            }

            // Werk de gebruiker in localStorage bij
            user.favourites = updatedFavourites;
            localStorage.setItem("user", JSON.stringify(user));

            // Update de UI
            setIsFavourite(!isAlreadyFavourite);
            setPrompt(prevPrompt => ({
                ...prevPrompt,
                favourites: isAlreadyFavourite ? prevPrompt.favourites - 1 : prevPrompt.favourites + 1
            }));

            // Stuur de gewijzigde favorieten naar de server
            const response = await fetch(`/api/prompts/${prompt.id}/favourite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to favourite/unfavourite the prompt.");
            }

            const data = await response.json();
        } catch (error) {
            console.error("Error favouriting:", error);
        }
    };





    const handleReviewSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setReviewText("");
        setReviewRating(0);
    };

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
        <>
            <Navbar />
            <main className="flex flex-col items-center gap-6 mt-16">
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
                    <div className="flex flex-col items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 text-center">{prompt.title}</h1>
                        <p className="text-gray-600 text-center">{prompt.description}</p>
                    </div>

                    {/* Secties van Views, Favourites, Rating */}
                    <div className="flex justify-between mb-6">
                        {/* Views */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Views</h3>
                            <div className="flex items-center justify-center gap-2 text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.55-4.55a1 1 0 011.4 0l2.1 2.1a1 1 0 010 1.4L18 15m-6-2l-4.55 4.55a1 1 0 010 1.4l-2.1 2.1a1 1 0 01-1.4 0L3 18m9-9v2m0 4h.01M21 12c0 8-9 13-9 13S3 20 3 12 12 5 12 5s9 3 9 7z" />
                                </svg>
                                <p className="text-gray-600 font-semibold">{prompt.views} views</p>
                            </div>
                        </div>

                        {/* Favourites */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Favourites</h3>
                            <div className="flex items-center justify-center gap-2 text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${isFavourite ? 'fill-red-500' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c-.3-.921-1.602-.921-1.902 0l-3.69 11.235a1 1 0 00.568 1.318l9.22 3.046c.772.256 1.485-.404 1.39-1.173l-3.69-11.235a1 1 0 00-.568-1.318l-9.22-3.046c-.772-.257-1.485.404-1.39 1.173l3.69 11.235a1 1 0 00.568 1.318l9.22 3.046c.772.256 1.485-.404 1.39-1.173l-3.69-11.235a1 1 0 00-.568-1.318l9.22-3.046z" />
                                </svg>
                                <p className="text-gray-600 font-semibold">{prompt.favourites}</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
                            <div className="flex items-center justify-center gap-2 text-yellow-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 .587l3.668 7.425 8.167 1.163-5.917 5.809 1.395 8.116L12 18.897l-7.313 3.844 1.395-8.116L.165 9.175l8.167-1.163L12 .587z" />
                                </svg>
                                <p className="text-gray-600 font-semibold">{prompt.rating || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Favorieten-knop */}
                    <div className="flex justify-between items-center mb-6">
                        <Link to={`/profile/${prompt.user.name}`}
                              className="text-orange-500 font-semibold hover:underline">
                            Author: @{prompt.user.name}
                        </Link>
                        <button
                            onClick={handleFavourite}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 focus:outline-none"
                        >
                            {isFavourite ? 'Unfavourite' : 'Favourite'}
                        </button>

                    </div>

                    {/* Review formulier */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave a Review</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Write your review..."
                        />
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`w-8 h-8 cursor-pointer ${star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        onClick={() => setReviewRating(star)}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03L12 17.27z"
                                        />
                                    </svg>
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 focus:outline-none"
                            >
                                Submit Review
                            </button>
                        </form>
                        {submitted && <p className="text-green-600 mt-4">Your review has been submitted!</p>}
                    </div>

                    {/* Reviews sectie */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h3>
                        <div className="space-y-6">
                            {prompt.reviews && prompt.reviews.length > 0 ? (
                                prompt.reviews.map((review, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                                        <div className="flex items-center mb-2">
                                            <h4 className="font-semibold text-gray-800">{review.user.name}</h4>
                                            <p className="ml-2 text-sm text-gray-500">Rating: {review.rating}</p>
                                        </div>
                                        <p className="text-gray-600">{review.review}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 text-center">No reviews available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default SinglePrompt;
