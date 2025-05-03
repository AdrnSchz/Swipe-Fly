import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterScreen.css';

function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordMatchError('Las contraseñas no coinciden.');
            return;
        }
        setPasswordMatchError('');

        // Simulación de llamada al backend para registrarse
        // Aquí deberías enviar 'username', 'email' y 'password' a tu backend
        const response = await new Promise((resolve) =>
            setTimeout(() => {
                // Simulación de registro exitoso (siempre exitoso para este ejemplo)
                resolve({ success: true, message: 'Registro exitoso', token: 'fakeToken' });
            }, 1000) // Simulación de 1 segundo de espera
        );

        if (response.success) {
            alert(response.message);
            // Aquí podrías decidir si iniciar sesión automáticamente o redirigir al login
            // Para iniciar sesión automáticamente, podrías llamar a navigate('/') directamente
            navigate('/login'); // Redirigir al login tras el registro
        } else {
            alert(`Error al registrar: ${response.message}`);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Crear Cuenta</h2>
            <form onSubmit={handleRegister} className="register-form">
                <div className="input-group">
                    <label htmlFor="username">Usuario:</label>
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
                    <label htmlFor="email">Correo Electrónico:</label>
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
                    <label htmlFor="password">Contraseña:</label>
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
                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="register-input"
                        required
                    />
                    {passwordMatchError && <p className="error-message">{passwordMatchError}</p>}
                </div>
                <button type="submit" className="register-button">
                    Registrarse
                </button>
            </form>
            <p className="register-login-link">
                ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
            </p>
        </div>
    );
}

export default RegisterScreen;