import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../Styles/layout';
import { useGlobalContext } from '../../Context/globalContext';
import { toast } from 'react-toastify';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const GOAL_ICONS = ['🎯', '🏠', '🚗', '✈️', '💰', '📚', '💻', '🎓', '💍', '🏥', '🎮', '📱'];

function Goals() {
    const { goals, addGoal, updateGoal, deleteGoal, getGoals } = useGlobalContext();
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [icon, setIcon] = useState('🎯');
    const [contributionAmounts, setContributionAmounts] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        getGoals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !targetAmount) {
            toast.error('Please fill in title and target amount');
            return;
        }
        try {
            await addGoal({
                title,
                targetAmount: parseFloat(targetAmount),
                deadline: deadline || undefined,
                icon
            });
            toast.success('Goal created! 🎯');
            setTitle('');
            setTargetAmount('');
            setDeadline('');
            setIcon('🎯');
        } catch (error) {
            toast.error('Failed to create goal');
        }
    };

    const handleContribute = async (goalId, currentAmount) => {
        const amount = parseFloat(contributionAmounts[goalId]);
        if (!amount || amount <= 0) {
            toast.error('Enter a valid contribution amount');
            return;
        }
        try {
            await updateGoal(goalId, { currentAmount: currentAmount + amount });
            toast.success(`Added $${amount.toLocaleString()} to goal! 💪`);
            setContributionAmounts(prev => ({ ...prev, [goalId]: '' }));
        } catch (error) {
            toast.error('Failed to update goal');
        }
    };

    const handleDelete = (id) => {
        setDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        try {
            await deleteGoal(deleteConfirm);
            toast.success('Goal removed');
        } catch (error) {
            toast.error('Failed to delete goal');
        }
        setDeleteConfirm(null);
    };

    const getProgressColor = (pct) => {
        if (pct >= 100) return '#2ed573';
        if (pct >= 75) return '#667eea';
        if (pct >= 50) return '#ffa502';
        return '#ff6b81';
    };

    const getDaysRemaining = (deadline) => {
        if (!deadline) return null;
        const diff = new Date(deadline) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallPct = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0;

    return (
        <GoalsStyled>
            <InnerLayout>
                <h2>Financial Goals</h2>

                {/* Summary Cards */}
                <div className="summary-row">
                    <div className="summary-card">
                        <div className="summary-icon target-icon"><i className="fa-solid fa-bullseye"></i></div>
                        <div className="summary-info">
                            <span className="summary-label">Total Target</span>
                            <h3>${totalTarget.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon saved-icon"><i className="fa-solid fa-coins"></i></div>
                        <div className="summary-info">
                            <span className="summary-label">Total Saved</span>
                            <h3>${totalSaved.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon progress-icon"><i className="fa-solid fa-chart-simple"></i></div>
                        <div className="summary-info">
                            <span className="summary-label">Overall Progress</span>
                            <h3>{overallPct}%</h3>
                        </div>
                    </div>
                </div>

                <div className="goals-content">
                    {/* Create Goal Form */}
                    <div className="goal-form-container">
                        <h3><i className="fa-solid fa-plus-circle"></i> Create a Goal</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Goal Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. New Laptop"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    id="goal-title"
                                />
                            </div>
                            <div className="form-group">
                                <label>Target Amount ($)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1500"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    min="1"
                                    id="goal-target"
                                />
                            </div>
                            <div className="form-group">
                                <label>Deadline (optional)</label>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    id="goal-deadline"
                                />
                            </div>
                            <div className="form-group">
                                <label>Icon</label>
                                <div className="icon-picker">
                                    {GOAL_ICONS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            className={`icon-btn ${icon === emoji ? 'active' : ''}`}
                                            onClick={() => setIcon(emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="submit-btn" id="goal-submit">
                                <i className="fa-solid fa-plus"></i> Create Goal
                            </button>
                        </form>
                    </div>

                    {/* Goals List */}
                    <div className="goals-list">
                        <h3><i className="fa-solid fa-trophy"></i> Your Goals</h3>
                        {goals.length === 0 ? (
                            <div className="empty-state">
                                <i className="fa-solid fa-bullseye"></i>
                                <p>No goals yet. Create one to start saving!</p>
                            </div>
                        ) : (
                            goals.map((goal) => {
                                const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                                const color = getProgressColor(pct);
                                const remaining = goal.targetAmount - goal.currentAmount;
                                const daysLeft = getDaysRemaining(goal.deadline);
                                const isCompleted = pct >= 100;

                                return (
                                    <div className={`goal-card ${isCompleted ? 'completed' : ''}`} key={goal._id}>
                                        <div className="goal-header">
                                            <div className="goal-title-row">
                                                <span className="goal-emoji">{goal.icon}</span>
                                                <div>
                                                    <h4>{goal.title}</h4>
                                                    <div className="goal-meta">
                                                        {daysLeft !== null && (
                                                            <span className={`deadline-badge ${daysLeft < 0 ? 'overdue' : daysLeft <= 7 ? 'urgent' : ''}`}>
                                                                <i className="fa-solid fa-clock"></i>
                                                                {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                                                            </span>
                                                        )}
                                                        {isCompleted && (
                                                            <span className="completed-badge">
                                                                <i className="fa-solid fa-check-circle"></i> Completed!
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="delete-btn" onClick={() => handleDelete(goal._id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>

                                        <div className="goal-amounts">
                                            <span style={{ color }}>${goal.currentAmount.toLocaleString()}</span>
                                            <span className="goal-target-text">of ${goal.targetAmount.toLocaleString()}</span>
                                        </div>

                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${pct}%`, background: color }}
                                            ></div>
                                        </div>

                                        <div className="progress-info">
                                            <span className="pct-label" style={{ color }}>
                                                {pct.toFixed(1)}%
                                            </span>
                                            {remaining > 0 && (
                                                <span className="remaining-text">
                                                    ${remaining.toLocaleString()} remaining
                                                </span>
                                            )}
                                        </div>

                                        {!isCompleted && (
                                            <div className="contribute-row">
                                                <input
                                                    type="number"
                                                    placeholder="Add amount..."
                                                    value={contributionAmounts[goal._id] || ''}
                                                    onChange={(e) => setContributionAmounts(prev => ({
                                                        ...prev,
                                                        [goal._id]: e.target.value
                                                    }))}
                                                    min="1"
                                                />
                                                <button
                                                    className="contribute-btn"
                                                    onClick={() => handleContribute(goal._id, goal.currentAmount)}
                                                >
                                                    <i className="fa-solid fa-plus"></i> Add
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </InnerLayout>

            <ConfirmModal
                isOpen={!!deleteConfirm}
                title="Delete Goal"
                message="Are you sure you want to delete this financial goal? All progress will be lost."
                confirmText="Delete"
                danger={true}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirm(null)}
            />
        </GoalsStyled>
    );
}

const GoalsStyled = styled.div`
    /* Summary Row */
    .summary-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin: 1.5rem 0;
    }

    .summary-card {
        background: var(--card-bg, #FCF6F9);
        border: 2px solid var(--card-border, #FFFFFF);
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 16px;
        padding: 1.2rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.2s ease;
        &:hover { transform: translateY(-3px); }
    }

    .summary-icon {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: white;
        flex-shrink: 0;
    }
    .target-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
    .saved-icon { background: linear-gradient(135deg, #2ed573, #7bed9f); }
    .progress-icon { background: linear-gradient(135deg, #ffa502, #fdcb6e); }

    .summary-info {
        .summary-label {
            font-size: 0.75rem;
            color: var(--primary-color3);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        h3 {
            font-size: 1.4rem;
            color: var(--primary-color);
            margin-top: 2px;
        }
    }

    /* Content Layout */
    .goals-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
    }

    /* Form */
    .goal-form-container {
        background: var(--card-bg, #FCF6F9);
        border: 2px solid var(--card-border, #FFFFFF);
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1.5rem;
        height: fit-content;
        h3 {
            color: var(--primary-color);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
            i { color: #667eea; }
        }
        .form-group {
            margin-bottom: 1rem;
            label {
                display: block;
                margin-bottom: 0.3rem;
                font-weight: 600;
                color: var(--primary-color2);
                font-size: 0.9rem;
            }
            input {
                width: 100%;
                padding: 10px 14px;
                border: 2px solid var(--input-border, #e8e8e8);
                border-radius: 10px;
                font-family: 'Nunito', sans-serif;
                font-size: 0.95rem;
                outline: none;
                transition: border-color 0.3s ease;
                background: var(--input-bg, white);
                color: var(--primary-color);
                &:focus { border-color: #667eea; }
            }
        }
        .icon-picker {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            .icon-btn {
                width: 38px;
                height: 38px;
                border: 2px solid var(--input-border, #e8e8e8);
                border-radius: 10px;
                background: var(--input-bg, white);
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                &.active {
                    border-color: #667eea;
                    background: rgba(102, 126, 234, 0.1);
                    transform: scale(1.1);
                }
                &:hover { border-color: #667eea; }
            }
        }
        .submit-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            font-family: 'Nunito', sans-serif;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
            }
        }
    }

    /* Goals List */
    .goals-list {
        h3 {
            color: var(--primary-color);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
            i { color: #ffa502; }
        }
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        background: var(--card-bg, #FCF6F9);
        border: 2px solid var(--card-border, #FFFFFF);
        border-radius: 20px;
        i {
            font-size: 3rem;
            color: var(--primary-color3);
            margin-bottom: 1rem;
        }
        p { color: var(--primary-color2); }
    }

    /* Goal Card */
    .goal-card {
        background: var(--card-bg, #FCF6F9);
        border: 2px solid var(--card-border, #FFFFFF);
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 16px;
        padding: 1.2rem;
        margin-bottom: 1rem;
        transition: all 0.2s ease;
        &:hover { transform: translateX(4px); }
        &.completed {
            border-color: rgba(46, 213, 115, 0.3);
            background: var(--card-bg, rgba(46, 213, 115, 0.05));
        }
    }

    .goal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.8rem;
    }

    .goal-title-row {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        .goal-emoji {
            font-size: 2rem;
            width: 50px;
            height: 50px;
            background: var(--input-bg, #f5f5f5);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        h4 {
            color: var(--primary-color);
            font-size: 1.1rem;
        }
    }

    .goal-meta {
        display: flex;
        gap: 0.5rem;
        margin-top: 2px;
    }

    .deadline-badge, .completed-badge {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        i { font-size: 0.7rem; }
    }

    .deadline-badge {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        &.urgent {
            background: rgba(255, 165, 2, 0.1);
            color: #ffa502;
        }
        &.overdue {
            background: rgba(255, 71, 87, 0.1);
            color: #ff4757;
        }
    }

    .completed-badge {
        background: rgba(46, 213, 115, 0.1);
        color: #2ed573;
    }

    .delete-btn {
        background: none;
        border: none;
        color: var(--color-delete);
        cursor: pointer;
        font-size: 1rem;
        padding: 4px 8px;
        border-radius: 8px;
        transition: all 0.2s ease;
        &:hover { background: rgba(255, 0, 0, 0.08); }
    }

    .goal-amounts {
        display: flex;
        align-items: baseline;
        gap: 6px;
        margin-bottom: 0.5rem;
        span:first-child {
            font-size: 1.3rem;
            font-weight: 700;
        }
        .goal-target-text {
            font-size: 0.9rem;
            color: var(--primary-color2);
        }
    }

    .progress-bar {
        width: 100%;
        height: 12px;
        background: var(--input-border, #e8e8e8);
        border-radius: 10px;
        overflow: hidden;
        .progress-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
    }

    .progress-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.4rem;
        .pct-label {
            font-size: 0.85rem;
            font-weight: 700;
        }
        .remaining-text {
            font-size: 0.8rem;
            color: var(--primary-color3);
        }
    }

    .contribute-row {
        display: flex;
        gap: 8px;
        margin-top: 0.8rem;
        input {
            flex: 1;
            padding: 8px 12px;
            border: 2px solid var(--input-border, #e8e8e8);
            border-radius: 10px;
            font-family: 'Nunito', sans-serif;
            font-size: 0.9rem;
            outline: none;
            background: var(--input-bg, white);
            color: var(--primary-color);
            &:focus { border-color: #2ed573; }
        }
        .contribute-btn {
            padding: 8px 16px;
            background: linear-gradient(135deg, #2ed573, #7bed9f);
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            font-family: 'Nunito', sans-serif;
            font-size: 0.85rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.3s ease;
            white-space: nowrap;
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 3px 15px rgba(46, 213, 115, 0.3);
            }
        }
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
        .summary-row {
            grid-template-columns: 1fr;
        }
        .goals-content {
            grid-template-columns: 1fr;
        }
    }
`;

export default Goals;
