import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setIsLoggedIn }) => {
    const [emailOrUsername, setEmailOrUsername] = useState(''); // Wijzig de naam naar emailOrUsername
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setIsLoading(true);

        try {
            // Verstuur de email of gebruikersnaam samen met het wachtwoord
            const response = await axios.post('/api/login', { email_or_username: emailOrUsername, password });

            // Sla het token op in localStorage
            localStorage.setItem('token', response.data.token);
            // setIsLoggedIn(true);  // Zet de inlogstatus naar true

            alert('Login successful!');
        } catch (err) {
            setIsLoading(false);

            // Log de error om meer informatie te krijgen
            console.error("Login error:", err);

            if (err.response && err.response.data) {
                setErrors(err.response.data.errors || { message: err.response.data.message });
            } else {
                setErrors({ message: 'An unknown error occurred.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

            {errors && (
                <div className="text-red-500 text-center mb-4">
                    {errors.message && <p>{errors.message}</p>}
                    {errors.email && <p>{errors.email[0]}</p>}
                    {errors.password && <p>{errors.password[0]}</p>}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Email or Username</label>
                    <input
                        type="text" // We gebruiken 'text' zodat zowel email als gebruikersnaam ingevoerd kunnen worden
                        value={emailOrUsername}  // Verbind de input met de state
                        onChange={(e) => setEmailOrUsername(e.target.value)}  // Update de waarde van de state
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
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;