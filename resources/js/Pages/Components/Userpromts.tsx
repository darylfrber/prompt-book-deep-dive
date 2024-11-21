"use client";

import { Badge, Button, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";
import {Link} from "react-router-dom";

export function MessageCard() {
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
        prompts.map((prompt) => (
            <div className="p-6">
                <Card className="max-w-sm">
                    <Link to={`/prompt/${prompt.id}`} className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {prompt.title}
                    </Link>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {prompt.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Badge icon={HiCheck}>Test</Badge>
                    </div>
                </Card>
            </div>
        ))
    );
}
