"use client";

import { Badge, Button, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Inputfield } from "./Inputfield";

export function MessageCard({ prompts }) {

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
                        {prompt.tags && prompt.tags.map((tag, index) => {
                            return (
                                <Badge icon={HiCheck} key={index} color="primary" className="text-white">
                                    {tag}
                                </Badge>
                            );
                        })}
                    </div>
                </Card>
            </div>
        ))
    );
}
