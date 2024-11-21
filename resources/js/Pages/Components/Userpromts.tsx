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
                </Card>
            </div>
        ))
    );
}
