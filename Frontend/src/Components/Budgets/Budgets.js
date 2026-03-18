import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../Styles/layout';
import { useGlobalContext } from '../../Context/globalContext';
import { toast } from 'react-toastify';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const EXPENSE_CATEGORIES = [
    'education', 'groceries', 'health', 'subscriptions',
    'takeaways', 'clothing', 'travelling', 'other'
];

function Budgets() {
    const { budgets, addBudget, getBudgets, deleteBudget, expenses, getExpenses } = useGlobalContext();
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const alertsShown = React.useRef(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        getBudgets(currentMonth, currentYear);
        getExpenses();
    }, []);

    // Budget Alerts
    useEffect(() => {
        if (budgets.length > 0 && expenses.length > 0 && !alertsShown.current) {
            alertsShown.current = true;
            budgets.forEach(budget => {
                const spent = getSpentByCategory(budget.category);
                const pct = (spent / budget.amount) * 100;
                const catName = budget.category.charAt(0).toUpperCase() + budget.category.slice(1);
                if (pct >= 100) {
                    toast.error(`🚨 ${catName} budget exceeded! $${spent.toFixed(0)} / $${budget.amount.toFixed(0)}`, { toastId: `alert-${budget._id}-over` });
                } else if (pct >= 80) {
                    toast.warn(`⚠️ ${catName} budget at ${pct.toFixed(0)}%! $${spent.toFixed(0)} / $${budget.amount.toFixed(0)}`, { toastId: `alert-${budget._id}-warn` });
                }
            });
        }
    }, [budgets, expenses]);

    const getSpentByCategory = (cat) => {
        return expenses
            .filter(e => {
                const d = new Date(e.date);
                return e.category === cat && d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
            })
            .reduce((sum, e) => sum + e.amount, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category || !amount) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            await addBudget({ category, amount: parseFloat(amount), month: currentMonth, year: currentYear });
            toast.success('Budget set successfully!');
            setCategory('');
            setAmount('');
            alertsShown.current = false; // Reset alerts for new budget check
        } catch (error) {
            toast.error('Failed to set budget');
        }
    };

    const getProgressColor = (pct) => {
        if (pct >= 100) return '#ff4757';
        if (pct >= 75) return '#ffa502';
        return '#2ed573';
    };

    const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });

    return (
        <BudgetsStyled>
            <InnerLayout>
                <h2>Budgets <span className="month-badge">{monthName} {currentYear}</span></h2>
                <div className="budget-content">
                    <div className="budget-form-container">
                        <h3>Set a Budget</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    id="budget-category"
                                >
                                    <option value="">Select category...</option>
                                    {EXPENSE_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Monthly Limit ($)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="1"
                                    id="budget-amount"
                                />
                            </div>
                            <button type="submit" id="budget-submit">
                                <i className="fa-solid fa-plus"></i> Set Budget
                            </button>
                        </form>
                    </div>
                    <div className="budget-list">
                        <h3>Budget Overview</h3>
                        {budgets.length === 0 ? (
                            <div className="empty-state">
                                <i className="fa-solid fa-piggy-bank"></i>
                                <p>No budgets set yet. Create one to start tracking!</p>
                            </div>
                        ) : (
                            budgets.map((budget) => {
                                const spent = getSpentByCategory(budget.category);
                                const pct = Math.min((spent / budget.amount) * 100, 100);
                                const rawPct = (spent / budget.amount) * 100;
                                const color = getProgressColor(pct);
                                return (
                                    <div className={`budget-item ${rawPct >= 100 ? 'over-budget' : rawPct >= 80 ? 'near-budget' : ''}`} key={budget._id}>
                                        <div className="budget-header">
                                            <div className="budget-info">
                                                <h4>
                                                    {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                                                    {rawPct >= 100 && <span className="alert-badge danger">🚨 Over!</span>}
                                                    {rawPct >= 80 && rawPct < 100 && <span className="alert-badge warning">⚠️ {rawPct.toFixed(0)}%</span>}
                                                </h4>
                                                <p className="budget-amounts">
                                                    <span style={{ color }}>${spent.toFixed(0)}</span> / ${budget.amount.toFixed(0)}
                                                </p>
                                            </div>
                                            <button
                                                className="delete-btn"
                                                onClick={() => setDeleteConfirm(budget._id)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${pct}%`, background: color }}
                                            ></div>
                                        </div>
                                        <span
                                            className="pct-label"
                                            style={{ color }}
                                        >
                                            {pct.toFixed(0)}% used
                                            {pct >= 100 && ' ⚠️ Over budget!'}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </InnerLayout>

            <ConfirmModal
                isOpen={!!deleteConfirm}
                title="Delete Budget"
                message="Are you sure you want to remove this budget limit?"
                confirmText="Delete"
                danger={true}
                onConfirm={async () => {
                    await deleteBudget(deleteConfirm);
                    toast.success('Budget removed');
                    setDeleteConfirm(null);
                }}
                onCancel={() => setDeleteConfirm(null)}
            />
        </BudgetsStyled>
    );
}

const BudgetsStyled = styled.div`
    h2 {
        display: flex;
        align-items: center;
        gap: 1rem;
        .month-badge {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
    }

    .budget-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
        margin-top: 1.5rem;
    }

    .budget-form-container {
        background: var(--card-bg);
        border: 2px solid var(--card-border);
        box-shadow: 0px 1px 15px var(--shadow-color);
        border-radius: 20px;
        padding: 1.5rem;
        height: fit-content;
        h3 {
            color: var(--primary-color);
            margin-bottom: 1rem;
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
            select, input {
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
        button {
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
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
            }
        }
    }

    .budget-list {
        h3 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        background: var(--card-bg);
        border: 2px solid var(--card-border);
        border-radius: 20px;
        i {
            font-size: 3rem;
            color: var(--primary-color3);
            margin-bottom: 1rem;
        }
        p {
            color: var(--primary-color2);
        }
    }

    .budget-item {
        background: var(--card-bg);
        border: 2px solid var(--card-border);
        box-shadow: 0px 1px 15px var(--shadow-color);
        border-radius: 16px;
        padding: 1.2rem;
        margin-bottom: 1rem;
        transition: all 0.2s ease;
        &:hover {
            transform: translateX(4px);
        }
        &.over-budget {
            border-color: rgba(255, 71, 87, 0.4);
            animation: pulse-danger 2s ease-in-out infinite;
        }
        &.near-budget {
            border-color: rgba(255, 165, 2, 0.4);
        }
        .budget-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.6rem;
            h4 {
                color: var(--primary-color);
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .budget-amounts {
                font-size: 0.9rem;
                color: var(--primary-color2);
                span {
                    font-weight: 700;
                    font-size: 1rem;
                }
            }
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
            &:hover {
                background: rgba(255, 0, 0, 0.08);
            }
        }
        .progress-bar {
            width: 100%;
            height: 10px;
            background: #e8e8e8;
            border-radius: 10px;
            overflow: hidden;
            .progress-fill {
                height: 100%;
                border-radius: 10px;
                transition: width 0.6s ease;
            }
        }
        .pct-label {
            font-size: 0.8rem;
            font-weight: 600;
            margin-top: 0.3rem;
            display: block;
        }
    }

    .alert-badge {
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 8px;
        font-weight: 700;
        &.danger {
            background: rgba(255, 71, 87, 0.1);
            color: #ff4757;
        }
        &.warning {
            background: rgba(255, 165, 2, 0.1);
            color: #ffa502;
        }
    }

    @keyframes pulse-danger {
        0%, 100% { box-shadow: 0px 1px 15px var(--shadow-color); }
        50% { box-shadow: 0 0 20px rgba(255, 71, 87, 0.15); }
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
        .budget-content {
            grid-template-columns: 1fr;
        }
        h2 {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
`;

export default Budgets;
