"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useState, KeyboardEvent } from "react";

export function Inputfield() {
    const [openModal, setOpenModal] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

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
            console.log("Prompt created successfully:", data);
        } catch (error: any) {
            console.error("Error creating prompt:", error);
            alert(`Error: ${error.message}`);
        }
    };


    return (
        <>
            <Button onClick={() => setOpenModal(true)}>Create Prompt</Button>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create your own prompt</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="Titel" value="Titel" />
                            </div>
                            <TextInput
                                id="Titel"
                                placeholder="Type your title here"
                                value={title}
                                onChange={handleTitelChange}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description" value="Description" />
                            </div>
                            <TextInput
                                id="Description"
                                placeholder="Type your description here"
                                value={description}
                                onChange={handleDescriptionChange}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="tags" value="Tags" />
                            </div>
                            <TextInput
                                id="Tags"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a tag and press Enter"
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
                            <Button onClick={() => {
                                Createprompt();
                                setOpenModal(false);
                            }}>Create your prompt</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
