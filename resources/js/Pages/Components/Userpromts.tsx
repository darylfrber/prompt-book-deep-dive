"use client";

import { Badge, Button, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Inputfield } from "./Inputfield";

export function MessageCard({ prompts }) {

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
            {prompts.map((prompt) => (
                <div className="w-full" key={prompt.id}>
                    <div className="h-auto border rounded-lg p-4 shadow-md flex flex-col">
                        <Link to={`/prompt/${prompt.id}`} className="text-2xl font-bold tracking-tight text-neutral-700">
                            {prompt.title}
                        </Link>
                        <p className="font-normal text-gray-700 dark:text-gray-600 flex-grow pt-4">
                            {prompt.description}
                        </p>
                        <div className="flex flex-wrap gap-3 pt-4">
                            {prompt.tags && prompt.tags.map((tag, index) => (
                                <div className="flex flex-wrap justify-center gap-3" key={index}>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm hover:bg-blue-200 transition-colors">
                                        {tag}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
