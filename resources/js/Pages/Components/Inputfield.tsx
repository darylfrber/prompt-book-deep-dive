"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useState, KeyboardEvent, useEffect } from "react";
import { MessageCard } from "./Userpromts";

export function Inputfield() {
    const [openModal, setOpenModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [prompt, setPrompt] = useState([]);

    const onCloseModal = () => {
        setOpenModal(false);
    };

    const handleTitelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            setTags((prevTags) => [...prevTags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const removeTag = (index: number) => {
        setTags((prevTags) => prevTags.filter((_, i) => i !== index));
    };

    const Createprompt = async () => {
        if (tags.length > 0) {
            try {
                const token = localStorage.getItem("token"); // Haal het token op uit localStorage
                if (!token) {
                    throw new Error("User is not authenticated. Please log in.");
                }

                const response = await fetch("/api/prompts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        tags,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to create the prompt");
                }

                const data = await response.json();
                setOpenModal(false);
                fetchData();
                console.log("Prompt created successfully:", data);
                setTitle("");
                setDescription("");
                setTags([]);
            } catch (error: any) {
                console.error("Error creating prompt:", error);
                alert(`Error: ${error.message}`);
            }
        } else {
            alert("Please fill in all the fields");
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch("/api/prompts");
            const promptData = await response.json();
            setPrompt(promptData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <>
            <div className="flex justify-center mt-4">
                <button
                    className="bg-orange-500 hover:bg-orange-300 text-white p-3 rounded-lg"
                    onClick={() => setOpenModal(true)}
                >
                    Create Prompt
                </button>
            </div>
            <Modal className="bg-neutral-700" show={openModal} size="md" onClose={onCloseModal} popup>
                <Modal.Header className="bg-neutral-800" />
                <Modal.Body className="bg-neutral-800">
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-white">Create your own prompt</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="Titel" value="Titel" />
                            </div>
                            <input
                                id="Titel"
                                placeholder="Type your title here"
                                value={title}
                                onChange={handleTitelChange}
                                required
                                className="w-full px-4 py-2 bg-neutral-200 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description" value="Description" />
                            </div>
                            <input
                                id="Description"
                                placeholder="Type your description here"
                                value={description}
                                onChange={handleDescriptionChange}
                                required
                                className="w-full px-4 py-2 bg-neutral-200 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="tags" value="Tags" />
                            </div>
                            <input
                                id="Tags"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a tag and press Enter"
                                required
                                className="w-full px-4 py-2 bg-neutral-200 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-2 py-1 rounded"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => removeTag(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full">
                            <button className="bg-orange-500 hover:bg-orange-300 text-white p-3 rounded-lg" onClick={() => {
                                Createprompt();
                            }}>Create your prompt</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <MessageCard prompts={prompt} />
        </>
    );
}
