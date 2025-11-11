import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import AuthNav from './AuthNav';
import Footer from './Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      });

      setSuccess('¡Usuario registrado exitosamente!');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Error al registrar usuario. Verifica tus datos e inténtalo de nuevo.');
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
                <h2>Únete a la comunidad</h2>
                <p>Crea tu cuenta y comienza a conectar con amigos y familiares de manera segura y moderna.</p>
              </div>
              <div className="brand-features">
                <div className="feature">
                  <i className="fas fa-user-plus"></i>
                  <span>Registro rápido y fácil</span>
                </div>
                <div className="feature">
                  <i className="fas fa-lock"></i>
                  <span>Datos protegidos</span>
                </div>
                <div className="feature">
                  <i className="fas fa-rocket"></i>
                  <span>Comienza en segundos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="auth-form-container">
            <div className="auth-form">
              <div className="form-header">
                <h2>Crea tu cuenta</h2>
                <p>Completa los datos para registrarte</p>
              </div>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                  <div className="input-wrapper">
                    <i className="fas fa-user input-icon"></i>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nombre completo"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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

                <div className="form-group">
                  <div className="input-wrapper">
                    <i className="fas fa-lock input-icon"></i>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirmar contraseña"
                      required
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" required />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-label">Acepto los términos y condiciones</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-btn"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i>
                      <span>Crear cuenta</span>
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>¿Ya tienes una cuenta?</p>
                <Link to="/login" className="auth-link">
                  Inicia sesión aquí
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

export default Register;
