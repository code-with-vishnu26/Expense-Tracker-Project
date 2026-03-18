import React from 'react';
import styled from 'styled-components';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorScreen>
                    <div className="error-content">
                        <div className="error-icon">
                            <i className="fa-solid fa-bug"></i>
                        </div>
                        <h2>Something went wrong</h2>
                        <p>The app ran into an unexpected error. Don't worry — your data is safe.</p>
                        <code className="error-detail">
                            {this.state.error?.message || 'Unknown error'}
                        </code>
                        <button className="btn-reset" onClick={this.handleReset}>
                            <i className="fa-solid fa-rotate-right"></i> Reload App
                        </button>
                    </div>
                </ErrorScreen>
            );
        }
        return this.props.children;
    }
}

const ErrorScreen = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    color: white;

    .error-content {
        text-align: center;
        padding: 3rem;
        max-width: 480px;
    }

    .error-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(255, 71, 87, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        i {
            font-size: 2.2rem;
            color: #ff6b81;
        }
    }

    h2 {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
    }

    p {
        color: rgba(255, 255, 255, 0.6);
        font-size: 1rem;
        margin-bottom: 1.2rem;
        line-height: 1.5;
    }

    code.error-detail {
        display: block;
        background: rgba(255, 255, 255, 0.08);
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 0.85rem;
        color: #ff6b81;
        margin-bottom: 1.5rem;
        word-break: break-word;
    }

    .btn-reset {
        padding: 12px 32px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
        border-radius: 14px;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        font-family: 'Nunito', sans-serif;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
        }
    }
`;

export default ErrorBoundary;
