"use client";

import { Badge, Button, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { Link } from "react-router-dom";

export function MessageCard() {
    const [prompts, setPrompt] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/prompts");
                const promptData = await response.json();
                setPrompt(promptData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    console.log(prompts);

    return (
        prompts.map((prompt) => (
            <div className="p-6" key={prompt.id}>
                <Card className="max-w-sm">
                    <Link to={`/prompt/${prompt.id}`} className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {prompt.title}
                    </Link>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {prompt.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {/* Check if tags exist and map over them */}
                        {prompt.tags && Array.isArray(prompt.tags) && prompt.tags.length > 0 ? (
                            prompt.tags.map((tag, index) => (
                                <Badge key={index} icon={HiCheck}>
                                    {tag}
                                </Badge>
                            ))
                        ) : (
                            <Badge icon={HiCheck}>No tags</Badge>
                        )}
                    </div>
                    <Button>
                        Read more
                        <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Button>
                </Card>
            </div>
        ))
    );
}
