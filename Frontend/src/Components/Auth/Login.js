import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../Context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
        setIsLoading(false);
    };

    return (
        <LoginStyled>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="logo-icon">
                            <i className="fa-solid fa-wallet"></i>
                        </div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to your expense tracker</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <i className="fa-solid fa-envelope"></i>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                id="login-email"
                            />
                        </div>
                        <div className="input-group">
                            <i className="fa-solid fa-lock"></i>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                id="login-password"
                            />
                        </div>
                        <button type="submit" disabled={isLoading} id="login-submit">
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>Sign In <i className="fa-solid fa-arrow-right"></i></>
                            )}
                        </button>
                    </form>
                    <div className="auth-footer">
                        <p><Link to="/forgot-password">Forgot Password?</Link></p>
                        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                    </div>
                </div>
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>
        </LoginStyled>
    );
}

const LoginStyled = styled.div`
    .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
        position: relative;
        overflow: hidden;
    }

    .floating-shapes {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        .shape {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.3;
            animation: float 8s infinite ease-in-out;
        }
        .shape-1 {
            width: 300px;
            height: 300px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            top: -100px;
            right: -50px;
            animation-delay: 0s;
        }
        .shape-2 {
            width: 200px;
            height: 200px;
            background: linear-gradient(135deg, #f093fb, #f5576c);
            bottom: -50px;
            left: -50px;
            animation-delay: 2s;
        }
        .shape-3 {
            width: 250px;
            height: 250px;
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            top: 50%;
            left: 50%;
            animation-delay: 4s;
        }
    }

    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        33% { transform: translateY(-30px) rotate(5deg); }
        66% { transform: translateY(20px) rotate(-3deg); }
    }

    .auth-card {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 24px;
        padding: 3rem;
        width: 100%;
        max-width: 440px;
        z-index: 1;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .auth-header {
        text-align: center;
        margin-bottom: 2rem;
        .logo-icon {
            width: 70px;
            height: 70px;
            margin: 0 auto 1rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        h1 {
            color: #ffffff;
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.3rem;
        }
        p {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.95rem;
        }
    }

    .input-group {
        position: relative;
        margin-bottom: 1.2rem;
        i {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.4);
            font-size: 1rem;
        }
        input {
            width: 100%;
            padding: 14px 16px 14px 48px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 14px;
            color: #ffffff;
            font-size: 1rem;
            font-family: 'Nunito', sans-serif;
            transition: all 0.3s ease;
            outline: none;
            &::placeholder {
                color: rgba(255, 255, 255, 0.35);
            }
            &:focus {
                border-color: #667eea;
                background: rgba(255, 255, 255, 0.1);
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
            }
        }
    }

    button {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
        border-radius: 14px;
        color: white;
        font-size: 1.05rem;
        font-weight: 600;
        font-family: 'Nunito', sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 0.5rem;
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        &:active {
            transform: translateY(0);
        }
        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        i {
            transition: transform 0.3s ease;
        }
        &:hover i {
            transform: translateX(4px);
        }
    }

    .spinner {
        width: 22px;
        height: 22px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .auth-footer {
        text-align: center;
        margin-top: 1.5rem;
        p {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
        }
        a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
            &:hover {
                color: #a78bfa;
            }
        }
    }
`;

export default Login;
