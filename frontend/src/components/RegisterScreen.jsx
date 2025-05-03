import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterScreen.css';

const API_URL = 'http://localhost:4000/api/auth/register';

function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        const apiData = {
            username: username,
            email: email,
            password: password,
            location: location,
        };

        try {
            const response = await axios.post(`${API_URL}`, apiData);
            console.log("Registration response:", response.data);
            navigate('/login');
        } catch (err) {
            console.error("Registration failed:", err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Create Account</h2>
            <form onSubmit={handleRegister} className="register-form">
                <div className="input-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="register-input"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="register-input"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="register-input"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="register-input"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="register-input"
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                </div>
                <button type="submit" className="register-button">
                    Registrarse
                </button>
            </form>
            <p className="register-login-link">
                ¿Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default RegisterScreen;