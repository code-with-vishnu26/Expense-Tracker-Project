import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <NotFoundStyled>
            <div className="not-found-content">
                <div className="error-code">
                    <span className="four">4</span>
                    <span className="zero">
                        <i className="fa-solid fa-circle-exclamation"></i>
                    </span>
                    <span className="four">4</span>
                </div>
                <h2>Page Not Found</h2>
                <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
                <div className="actions">
                    <button className="btn-home" onClick={() => navigate('/')}>
                        <i className="fa-solid fa-house"></i> Go Home
                    </button>
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-arrow-left"></i> Go Back
                    </button>
                </div>
            </div>
        </NotFoundStyled>
    );
}

const NotFoundStyled = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--main-bg, rgba(252, 246, 249, 0.78));

    .not-found-content {
        text-align: center;
        padding: 3rem;
    }

    .error-code {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        margin-bottom: 1.5rem;

        .four {
            font-size: 6rem;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
        }

        .zero {
            i {
                font-size: 4.5rem;
                background: linear-gradient(135deg, #ff4757, #ff6b81);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: pulse 2s ease-in-out infinite;
            }
        }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.7; }
    }

    h2 {
        font-size: 1.8rem;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }

    p {
        color: var(--primary-color3);
        font-size: 1rem;
        margin-bottom: 2rem;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.5;
    }

    .actions {
        display: flex;
        gap: 1rem;
        justify-content: center;

        .btn-home {
            padding: 12px 28px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
            border-radius: 14px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            font-family: 'Nunito', sans-serif;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            &:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
            }
        }

        .btn-back {
            padding: 12px 28px;
            background: var(--card-bg, #FCF6F9);
            border: 2px solid var(--card-border, #fff);
            border-radius: 14px;
            color: var(--primary-color);
            font-size: 1rem;
            font-weight: 600;
            font-family: 'Nunito', sans-serif;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            &:hover {
                border-color: #667eea;
                color: #667eea;
                transform: translateY(-3px);
            }
        }
    }

    @media (max-width: 480px) {
        .error-code .four { font-size: 4rem; }
        .error-code .zero i { font-size: 3rem; }
        h2 { font-size: 1.4rem; }
        .actions { flex-direction: column; }
    }
`;

export default NotFound;
