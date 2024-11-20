import React, { useEffect, useState } from 'react';
import Navbar from './Components/Navbar';
import { log } from 'console';

export default function Home() {

    const [prompts, setPrompt] = useState([]);

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
                            className="w-full py-2 px-4 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 relative z-10" />
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
            </main>
            <Footer prompts={prompts} />
        </>
    )
};

const TrendingPrompt = ({ title, description }) => (
    <div className="p-4 bg-gradient-to-r from-orange-200 to-orange-400 rounded-md shadow-sm hover:shadow-md transition duration-200">
        <h3 className="text-center text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-center text-sm text-gray-600 mt-2">{description}</p>
    </div>
);

function Footer({ prompts }) {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white py-4 sm:py-6 shadow-md">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-center text-lg font-semibold text-gray-900">Trending Prompts</h2>
                <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 sm:max-w-xl lg:mx-0 lg:max-w-none">
                    {prompts.map((prompt) => (
                        <TrendingPrompt
                            key={prompt?.id}
                            title={prompt?.title}
                            description={`Description or details about ${prompt?.description}.`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
};
