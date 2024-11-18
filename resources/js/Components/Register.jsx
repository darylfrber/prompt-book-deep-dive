import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset errors before new request

        try {
            const response = await axios.post('/api/register', {
                name,               // Gebruikersnaam
                email,
                password,
                password_confirmation: passwordConfirmation, // Zorg voor correcte veldnaam
            });

            console.log('Registration successful:', response.data);
        } catch (err) {
            if (err.response && err.response.data) {
                // API-fouten ophalen en opslaan in de `error` state
                const apiError = err.response.data;
                setError(apiError);
            } else {
                setError({ message: 'An unknown error occurred.' });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

            {/* Toon algemene foutmelding */}
            {error && error.message && (
                <p className="text-red-500 text-center mb-4">{error.message}</p>
            )}

            {/* Toon gedetailleerde foutmeldingen */}
            {error && error.errors && (
                <ul className="text-red-500 mb-4 list-disc list-inside">
                    {Object.entries(error.errors).map(([field, messages]) => (
                        <li key={field}>
                            <strong>{field}:</strong> {messages.join(', ')}
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
