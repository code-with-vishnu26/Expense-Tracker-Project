import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setIsLoading(true);
        try {
            await axios.put(`${BASE_URL}auth/reset-password/${token}`, { password });
            toast.success('Password reset successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Reset failed');
        }
        setIsLoading(false);
    };

    return (
        <ResetStyled>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="logo-icon">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <h1>Reset Password</h1>
                        <p>Enter your new password below</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <i className="fa-solid fa-lock"></i>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                id="reset-password"
                            />
                        </div>
                        <div className="input-group">
                            <i className="fa-solid fa-lock"></i>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                id="reset-confirm-password"
                            />
                        </div>
                        <button type="submit" disabled={isLoading} id="reset-submit">
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>Reset Password <i className="fa-solid fa-check"></i></>
                            )}
                        </button>
                    </form>
                    <div className="auth-footer">
                        <p>Back to <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>
        </ResetStyled>
    );
}

const ResetStyled = styled.div`
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

export default ResetPassword;
