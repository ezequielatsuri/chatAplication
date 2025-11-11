import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthNav from './AuthNav';
import Footer from './Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/login', { email, password });
      console.log('Login successful', response);
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/chat');
    } catch (error) {
      console.error('There was an error logging in!', error);
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthNav />
      
      <div className="auth-container">
        {/* Background Animation */}
        <div className="background-animation">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="auth-content">
          {/* Left Side - Brand */}
          <div className="auth-brand">
            <div className="brand-content">
              <div className="brand-logo">
                <i className="fas fa-comments"></i>
                <h1>SkeepChat</h1>
              </div>
              <div className="brand-description">
                <h2>Conecta con el mundo</h2>
                <p>Donde las palabras cobran vida y las distancias se desvanecen. Una experiencia que transforma cada conversación en un momento inolvidable.</p>
              </div>
              <div className="brand-features">
                <div className="feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>Mensajes seguros</span>
                </div>
                <div className="feature">
                  <i className="fas fa-bolt"></i>
                  <span>Comunicación instantánea</span>
                </div>
                <div className="feature">
                  <i className="fas fa-mobile-alt"></i>
                  <span>Multiplataforma</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="auth-form-container">
            <div className="auth-form">
              <div className="form-header">
                <h2>Bienvenido de vuelta</h2>
                <p>Inicia sesión para continuar</p>
              </div>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <div className="input-wrapper">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Correo electrónico"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <i className="fas fa-lock input-icon"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña"
                      required
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-label">Mantener sesión iniciada</span>
                  </label>
                  <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-btn"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i>
                      <span>Iniciar sesión</span>
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>¿No tienes una cuenta?</p>
                <Link to="/register" className="auth-link">
                  Regístrate aquí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
