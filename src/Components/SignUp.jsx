import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/auth/verify')
            .then(res => {
                if (res.data.status) {
                    navigate("/dashboard");
                }
            })
            .catch(error => {
                console.error('Error verifying user:', error);
            });
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!username || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        axios.post("/auth/signup", { username, email, password })
            .then(response => {
                if (response.data.status) {
                    navigate("/login");
                }
            })
            .catch(err => {
                setError('An error occurred. Please try again later.');
                console.error(err);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 mb-2">Username:</label>
                        <input type="text" id="username" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email:</label>
                        <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 mb-2">Password:</label>
                        <input type="password" id="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition duration-300">Sign Up</button>
                    <div className="mt-4 text-center">
                        <p className="text-gray-700">Already have an account?</p>
                        <button onClick={() => navigate("/login")} className="mt-2 text-teal-500 hover:underline">Login</button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
}
