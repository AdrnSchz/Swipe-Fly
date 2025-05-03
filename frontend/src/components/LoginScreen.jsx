import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginScreen.css';

const API_URL = 'http://localhost:4000/api/auth/login';

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        const apiData = {
            email: email,
            password: password,
        };

        try {
            const response = await axios.post(`${API_URL}`, apiData);
    
            console.log("Login successful:", response.data);
            const { user } = response.data;
    
            localStorage.setItem('userInfo', JSON.stringify(user));
            // sessionStorage.setItem('userInfo', JSON.stringify(user));
            
            navigate('/'); 
    
        } catch (err) {
            console.error("Login failed:", err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Login failed. Please check your credentials or try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
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
                        className="login-input"
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
            <p className="login-register-link">
                ¿Dont have an account yet? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default LoginScreen;