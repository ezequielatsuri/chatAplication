import React, { useState } from 'react';
import './Login.css';
import logo from './logo_login.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // Llama a la función useNavigate

    const enviar = (event) => {
        event.preventDefault();
        axios.post('/login', { email, password })  // Asegúrate de que esta URL es correcta y está configurada en tu backend
            .then(response => {
                console.log('Login successful', response);
                const token = response.data.token; // Asegúrate de que esto coincida con la estructura de tu respuesta
                localStorage.setItem('token', token);
                navigate('/chat');  // Redirige al usuario a /dashboard
            })
            .catch(error => {
                console.error('There was an error logging in!', error);
            });
    };

    return (
        <div className="main1">
            <div className="container">
                <div className="left">
                    <div className="circle-container">
                        <div className="circleMini green"></div>
                        <div className="circleMini pink"></div>
                        <div className="circle blue-circle"></div>
                        <div className="circle pink-circle"></div>
                        <div className="circle green-circle"></div>
                    </div>
                    
                    <nav>
                        <div className="navbar-top">
                            <img src={logo} alt="logo" className="logo" />
                        </div>
                        <div className="navbar-button">
                            <ul>
                                <li><a href="">About</a></li>
                                <li><a href="">Privacy</a></li>
                                <li><a href="">Terms of use</a></li>
                                <li><a href="">FAQ</a></li>
                            </ul> 
                        </div>
                    </nav>
                </div>
                <div className="right">
                    <div className="login-container">
                        <h2>Log in</h2>
                        <form onSubmit={enviar}>
                            <input 
                                type="text" 
                                name="email" 
                                value={email} 
                                placeholder="Email" 
                                required 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <input 
                                type="password" 
                                name="password" 
                                value={password} 
                                placeholder="Password" 
                                required 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label className="check_text">
                                <input type="checkbox" name="keep_logged" value="1" /> Keep me logged in
                            </label>
                            <input type="submit" value="Log in" />
                            <a href="#">Forgot Password?</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
