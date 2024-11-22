import React, { useEffect, useState } from 'react';
import Navbar from './Components/Navbar';
import { Link } from "react-router-dom";

export default function Home() {

    const [prompts, setPrompt] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Voor zoekterm
    const [filteredPrompts, setFilteredPrompts] = useState([]); // Gefilterde prompts
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal zichtbaar

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/prompts");
                const promtData = await response.json();
                setPrompt(promtData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setFilteredPrompts([]);
            setIsModalVisible(false);
            return;
        }

        // Filter prompts op basis van titel of tags
        const results = prompts.filter((prompt) =>
            prompt.title.toLowerCase().includes(value.toLowerCase()) ||
            prompt.tags.some((tag) =>
                tag.toLowerCase().includes(value.toLowerCase())
            )
        );

        setFilteredPrompts(results);
        setIsModalVisible(true);
    };

    const handleOverlayClick = () => {
        setSearchTerm('');
        setFilteredPrompts([]);
        setIsModalVisible(false);
    };

    return (
        <>
            <Navbar />
            <main className="flex flex-col items-center gap-6 mt-16">
                <h1 className="text-3xl font-bold text-center">
                    Power up your AI!
                    <br className="hidden md:inline" />
                    <span className="text-orange-500">Easy to use prompts!</span>
                </h1>
                <p className="text-gray-600 text-center max-w-md">
                    Quickly get prompts to level up your AI experience.
                </p>
                <form className="flex items-center w-full max-w-md mt-6">
                    <div className="relative group w-full">
                        <div
                            className="absolute -inset-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                        ></div>
                        <input
                            type="text"
                            placeholder="Search for prompts..."
                            className="w-full py-2 px-4 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 relative z-10"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-orange-500 z-20">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </span>
                    </div>
                </form>
                {isModalVisible && (
                    <SearchModal
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                        prompts={filteredPrompts}
                        onClose={handleOverlayClick}
                    />
                )}
            </main>
            <Footer prompts={prompts} />
        </>
    );
}

const SearchModal = ({ searchTerm, onSearchChange, prompts, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
    >
        <div
            className="bg-white w-4/5 md:w-1/2 rounded-lg p-6 shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // Stop de klik op de modal van de overlay
        >
            <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-xl font-semibold text-gray-800">Search Results</h3>
                <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    ×
                </button>
            </div>
            <div className="mt-4">
                <form className="flex items-center w-full max-w-md mx-auto">
                    <div className="relative group w-full">
                        <div
                            className="absolute -inset-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                        ></div>
                        <input
                            type="text"
                            placeholder="Search for prompts..."
                            className="w-full py-2 px-4 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 relative z-10"
                            value={searchTerm}
                            onChange={onSearchChange}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-orange-500 z-20">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </span>
                    </div>
                </form>
                <div className="mt-6 grid gap-4">
                    {prompts.length > 0 ? (
                        prompts.map((prompt) => (
                            <Link
                                key={prompt.id}
                                to={`/prompt/${prompt.id}`}
                                className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                <h4 className="font-bold text-lg">{prompt.title}</h4>
                                <p className="text-sm text-gray-600">{prompt.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {prompt.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-2 flex items-center space-x-2 text-gray-600">
                                    <span className="flex items-center">
                                        {/* Eye Icon for Views */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-5 h-5 mr-1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                        {prompt.views}
                                    </span>
                                    <span className="flex items-center">
                                        {/* Star Icon for Rating */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-5 h-5 mr-1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03L12 17.27z" />
                                        </svg>
                                        {prompt.average_rating}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No results found.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const Footer = ({ prompts }) => {
    const sortedPrompts = [...prompts].sort((a, b) => b.views - a.views); // Sorteer op views
    const trendingPrompts = sortedPrompts.slice(0, 5); // Top 5 prompts

    return (
        <div className="mt-5 bottom-0 left-0 w-full py-4 sm:py-6">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-center text-lg font-semibold text-gray-900">Trending Prompts</h2>
                <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 sm:max-w-xl lg:mx-0 lg:max-w-none">
                    {trendingPrompts.map((prompt) => (
                        <TrendingPrompt
                            key={prompt.id}
                            id={prompt.id}
                            title={prompt.title}
                            tags={prompt.tags}
                            description={prompt.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TrendingPrompt = ({ id, title, description, tags }) => (
    <Link to={`/prompt/${id}`} className="p-4 bg-gradient-to-r from-orange-200 to-orange-400 rounded-md shadow-sm hover:shadow-md transition duration-200">
        <h3 className="text-center text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-center text-sm text-gray-600 mt-2 line-clamp-3">
            {description}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
            {tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm hover:bg-blue-200 transition-colors">
                    {tag}
                </span>
            ))}
        </div>
    </Link>
);
