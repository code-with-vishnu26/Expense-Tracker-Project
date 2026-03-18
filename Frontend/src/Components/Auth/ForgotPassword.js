import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}auth/forgot-password`, { email });
            setResetToken(res.data.resetToken);
            setSent(true);
            toast.success('Reset token generated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Request failed');
        }
        setIsLoading(false);
    };

    return (
        <ForgotStyled>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="logo-icon">
                            <i className="fa-solid fa-key"></i>
                        </div>
                        <h1>Forgot Password</h1>
                        <p>Enter your email to receive a reset link</p>
                    </div>
                    {!sent ? (
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <i className="fa-solid fa-envelope"></i>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    id="forgot-email"
                                />
                            </div>
                            <button type="submit" disabled={isLoading} id="forgot-submit">
                                {isLoading ? (
                                    <span className="spinner"></span>
                                ) : (
                                    <>Send Reset Link <i className="fa-solid fa-paper-plane"></i></>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="success-panel">
                            <div className="success-icon">
                                <i className="fa-solid fa-circle-check"></i>
                            </div>
                            <p>A reset token has been generated for <strong>{email}</strong></p>
                            <div className="token-display">
                                <label>Your Reset Token:</label>
                                <code>{resetToken}</code>
                            </div>
                            <Link to={`/reset-password/${resetToken}`} className="reset-link-btn">
                                <i className="fa-solid fa-lock-open"></i> Reset Password Now
                            </Link>
                            <p className="note">⏰ This token expires in 10 minutes</p>
                        </div>
                    )}
                    <div className="auth-footer">
                        <p>Remember your password? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>
        </ForgotStyled>
    );
}

const ForgotStyled = styled.div`
    .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
        position: relative;
        overflow: hidden;
    }
    .auth-card {
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 24px;
        padding: 3rem;
        width: 420px;
        max-width: 90vw;
        z-index: 2;
    }
    .auth-header {
        text-align: center;
        margin-bottom: 2rem;
        .logo-icon {
            width: 64px; height: 64px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            i { color: white; font-size: 1.5rem; }
        }
        h1 { color: white; font-size: 1.8rem; margin-bottom: 0.3rem; }
        p { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
    }
    .input-group {
        position: relative;
        margin-bottom: 1.2rem;
        i {
            position: absolute;
            left: 14px; top: 50%;
            transform: translateY(-50%);
            color: rgba(255,255,255,0.4);
        }
        input {
            width: 100%;
            padding: 14px 14px 14px 40px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 12px;
            color: white;
            font-size: 0.95rem;
            outline: none;
            transition: all 0.3s;
            &:focus { border-color: #667eea; background: rgba(255,255,255,0.12); }
            &::placeholder { color: rgba(255,255,255,0.4); }
        }
    }
    button[type="submit"] {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
        border-radius: 12px;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        &:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(102,126,234,0.3); }
        &:disabled { opacity: 0.6; cursor: not-allowed; }
    }
    .spinner {
        width: 20px; height: 20px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .success-panel {
        text-align: center;
        .success-icon {
            i { font-size: 3rem; color: #2ed573; margin-bottom: 1rem; }
        }
        p { color: rgba(255,255,255,0.7); margin-bottom: 1rem; strong { color: white; } }
        .token-display {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
            label { color: rgba(255,255,255,0.5); font-size: 0.8rem; display: block; margin-bottom: 0.3rem; }
            code {
                color: #667eea;
                font-size: 0.85rem;
                word-break: break-all;
                display: block;
            }
        }
        .reset-link-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            &:hover { transform: translateY(-2px); }
        }
        .note {
            margin-top: 1rem;
            font-size: 0.8rem;
            color: rgba(255,255,255,0.4);
        }
    }
    .auth-footer {
        text-align: center;
        margin-top: 1.5rem;
        p { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        a { color: #667eea; text-decoration: none; font-weight: 600; &:hover { text-decoration: underline; } }
    }
    .floating-shapes {
        position: absolute;
        width: 100%; height: 100%;
        top: 0; left: 0;
        .shape {
            position: absolute;
            border-radius: 50%;
            opacity: 0.1;
        }
        .shape-1 { width: 300px; height: 300px; background: #667eea; top: -50px; right: -50px; animation: float1 6s ease-in-out infinite; }
        .shape-2 { width: 200px; height: 200px; background: #764ba2; bottom: -30px; left: -30px; animation: float2 8s ease-in-out infinite; }
        .shape-3 { width: 150px; height: 150px; background: #f093fb; top: 50%; left: 50%; animation: float3 7s ease-in-out infinite; }
    }
    @keyframes float1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, 30px); } }
    @keyframes float2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }
    @keyframes float3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-20px, -30px); } }
`;

export default ForgotPassword;
