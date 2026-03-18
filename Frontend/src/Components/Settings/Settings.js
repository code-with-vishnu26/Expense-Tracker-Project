import React, { useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../Styles/layout';
import { useAuth } from '../../Context/authContext';
import { useTheme } from '../../Context/ThemeContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import defaultAvatar from '../../img/avatar.png';

function Settings() {
    const { user, updateProfile, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currency, setCurrency] = useState(user?.currency || '$');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar ? `http://localhost:5000${user.avatar}` : defaultAvatar
    );

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/v1/auth/avatar', formData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setAvatarPreview(`http://localhost:5000${res.data.avatar}`);
            toast.success('Avatar updated!');
        } catch (err) {
            toast.error('Avatar upload failed');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateProfile({ name, email, currency });
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
        setIsLoading(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setIsLoading(true);
        try {
            await updateProfile({ password: newPassword });
            toast.success('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password change failed');
        }
        setIsLoading(false);
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/v1/export/csv', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transactions.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success('Data exported successfully!');
        } catch (error) {
            toast.error('Export failed');
        }
    };

    return (
        <SettingsStyled>
            <InnerLayout>
                <h2>Settings</h2>
                <div className="settings-content">
                    <div className="settings-card">
                        <div className="card-header">
                            <i className="fa-solid fa-user-pen"></i>
                            <h3>Profile Information</h3>
                        </div>
                        <div className="avatar-section">
                            <img src={avatarPreview} alt="Avatar" className="avatar-img" />
                            <label className="avatar-upload-btn" htmlFor="avatar-upload">
                                <i className="fa-solid fa-camera"></i> Change Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                id="avatar-upload"
                                style={{ display: 'none' }}
                                onChange={handleAvatarUpload}
                            />
                        </div>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    id="settings-name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="settings-email"
                                />
                            </div>
                            <div className="form-group">
                                <label>Currency Symbol</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    id="settings-currency"
                                >
                                    <option value="$">$ (USD)</option>
                                    <option value="€">€ (EUR)</option>
                                    <option value="£">£ (GBP)</option>
                                    <option value="₹">₹ (INR)</option>
                                    <option value="¥">¥ (JPY)</option>
                                    <option value="₿">₿ (BTC)</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary" disabled={isLoading} id="settings-save">
                                <i className="fa-solid fa-check"></i> Save Changes
                            </button>
                        </form>
                    </div>

                    <div className="settings-card">
                        <div className="card-header">
                            <i className="fa-solid fa-shield-halved"></i>
                            <h3>Change Password</h3>
                        </div>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    id="settings-new-password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    id="settings-confirm-password"
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isLoading} id="settings-change-password">
                                <i className="fa-solid fa-lock"></i> Change Password
                            </button>
                        </form>
                    </div>

                    <div className="settings-card">
                        <div className="card-header">
                            <i className="fa-solid fa-circle-half-stroke"></i>
                            <h3>Appearance</h3>
                        </div>
                        <p className="card-desc">Toggle between light and dark mode for comfortable viewing.</p>
                        <div className="theme-toggle">
                            <span className="theme-label">
                                <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                            <label className="switch" id="settings-theme-toggle">
                                <input
                                    type="checkbox"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="settings-card">
                        <div className="card-header">
                            <i className="fa-solid fa-file-export"></i>
                            <h3>Export Data</h3>
                        </div>
                        <p className="card-desc">Download all your income and expense data as a CSV file.</p>
                        <button className="btn-export" onClick={handleExport} id="settings-export">
                            <i className="fa-solid fa-download"></i> Export to CSV
                        </button>
                    </div>

                    <div className="settings-card danger-zone">
                        <div className="card-header">
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <h3>Session</h3>
                        </div>
                        <p className="card-desc">Sign out of your account on this device.</p>
                        <button className="btn-danger" onClick={logout} id="settings-logout">
                            <i className="fa-solid fa-sign-out"></i> Sign Out
                        </button>
                    </div>
                </div>
            </InnerLayout>
        </SettingsStyled>
    );
}

const SettingsStyled = styled.div`
    .settings-content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-top: 1.5rem;
    }

    .settings-card {
        background: var(--card-bg);
        border: 2px solid var(--card-border);
        box-shadow: 0px 1px 15px var(--shadow-color);
        border-radius: 20px;
        padding: 1.5rem;
        transition: transform 0.2s ease;
        &:hover {
            transform: translateY(-2px);
        }
        .card-header {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            margin-bottom: 1.2rem;
            i {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1rem;
            }
            h3 {
                color: var(--primary-color);
                font-size: 1.1rem;
            }
        }
        .avatar-section {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.2rem;
            .avatar-img {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid var(--card-border);
            }
            .avatar-upload-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border-radius: 10px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102,126,234,0.3); }
            }
        }
        .card-desc {
            color: var(--primary-color2);
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
    }

    .theme-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--input-bg);
        border: 2px solid var(--input-border);
        border-radius: 12px;
    }

    .theme-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: var(--primary-color);
        i { color: #ffa502; font-size: 1.1rem; }
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 52px;
        height: 28px;
        input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #ccc;
            transition: 0.3s;
            border-radius: 28px;
            &::before {
                content: '';
                position: absolute;
                height: 22px;
                width: 22px;
                left: 3px;
                bottom: 3px;
                background: white;
                transition: 0.3s;
                border-radius: 50%;
            }
        }
        input:checked + .slider {
            background: linear-gradient(135deg, #667eea, #764ba2);
        }
        input:checked + .slider::before {
            transform: translateX(24px);
        }
    }

    .form-group {
        margin-bottom: 1rem;
        label {
            display: block;
            margin-bottom: 0.3rem;
            font-weight: 600;
            color: var(--primary-color2);
            font-size: 0.85rem;
        }
        input, select {
            width: 100%;
            padding: 10px 14px;
            border: 2px solid var(--input-border);
            border-radius: 10px;
            font-family: 'Nunito', sans-serif;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.3s ease;
            background: var(--input-bg);
            color: var(--input-text);
            &:focus {
                border-color: #667eea;
            }
        }
    }

    .btn-primary {
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 0.95rem;
        font-weight: 600;
        font-family: 'Nunito', sans-serif;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.3s ease;
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    }

    .btn-export {
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, #2ed573, #7bed9f);
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 0.95rem;
        font-weight: 600;
        font-family: 'Nunito', sans-serif;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.3s ease;
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(46, 213, 115, 0.3);
        }
    }

    .danger-zone {
        border-color: rgba(255, 0, 0, 0.1);
    }

    .btn-danger {
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, #ff4757, #ff6b81);
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 0.95rem;
        font-weight: 600;
        font-family: 'Nunito', sans-serif;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.3s ease;
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
        }
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
        .settings-content {
            grid-template-columns: 1fr;
        }
    }
`;

export default Settings;
