import React from 'react';
import styled from 'styled-components';

function ConfirmModal({ isOpen, onConfirm, onCancel, title, message, confirmText, danger }) {
    if (!isOpen) return null;

    return (
        <ConfirmOverlay onClick={onCancel}>
            <ConfirmBox onClick={(e) => e.stopPropagation()}>
                <div className="confirm-icon">
                    <i className={`fa-solid ${danger ? 'fa-triangle-exclamation' : 'fa-circle-question'}`}></i>
                </div>
                <h3>{title || 'Are you sure?'}</h3>
                <p>{message || 'This action cannot be undone.'}</p>
                <div className="confirm-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={`btn-confirm ${danger ? 'danger' : ''}`} onClick={onConfirm}>
                        {confirmText || 'Confirm'}
                    </button>
                </div>
            </ConfirmBox>
        </ConfirmOverlay>
    );
}

const ConfirmOverlay = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease-out;

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ConfirmBox = styled.div`
    background: var(--card-bg, #FCF6F9);
    border: 2px solid var(--card-border, #fff);
    border-radius: 20px;
    padding: 2rem 2.5rem;
    width: 380px;
    max-width: 90vw;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    animation: scaleIn 0.2s ease-out;

    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }

    .confirm-icon {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        background: rgba(255, 71, 87, 0.1);
        i {
            font-size: 1.5rem;
            color: #ff4757;
        }
    }

    h3 {
        color: var(--primary-color);
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
    }

    p {
        color: var(--primary-color3);
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
        line-height: 1.4;
    }

    .confirm-actions {
        display: flex;
        gap: 0.8rem;

        .btn-cancel {
            flex: 1;
            padding: 10px;
            background: var(--input-bg, white);
            border: 2px solid var(--input-border, #e8e8e8);
            border-radius: 12px;
            color: var(--primary-color);
            font-weight: 600;
            font-family: 'Nunito', sans-serif;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            &:hover {
                border-color: #667eea;
                color: #667eea;
            }
        }

        .btn-confirm {
            flex: 1;
            padding: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            font-family: 'Nunito', sans-serif;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            }
            &.danger {
                background: linear-gradient(135deg, #ff4757, #ff6b81);
                &:hover {
                    box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
                }
            }
        }
    }
`;

export default ConfirmModal;
