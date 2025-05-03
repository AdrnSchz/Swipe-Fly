import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginScreen.css';

function LoginScreen({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Simulación de llamada al backend para iniciar sesión
        // Aquí deberías enviar 'username' y 'password' a tu backend
        const response = await new Promise((resolve) =>
            setTimeout(() => {
                if (username === 'test' && password === 'test') {
                    resolve({ success: true, token: 'fakeToken' });
                } else {
                    resolve({ success: false, message: 'Credenciales incorrectas' });
                }
            }, 1000) // Simulación de 1 segundo de espera
        );

        if (response.success) {
            onLoginSuccess(response.token); // Llama a la función en App para actualizar el estado
            navigate('/'); // Redirige a la ruta principal (donde está ChatApp condicionalmente)
        } else {
            alert(response.message);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    Iniciar Sesión
                </button>
            </form>
            <p className="login-register-link">
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
        </div>
    );
}

export default LoginScreen;