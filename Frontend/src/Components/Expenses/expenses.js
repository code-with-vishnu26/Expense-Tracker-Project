import React from "react";
import styled from "styled-components";
import {InnerLayout} from "../../Styles/layout";
import {useGlobalContext} from "../../Context/globalContext";
import {useEffect, useState} from "react";
import ExpenseForm from "./expenseform";
import IncomeItem from '../IncomeItem/incomeitem';
import { toast } from 'react-toastify';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

function Expenses() {
    const{expenses,getExpenses,deleteExpense,updateExpense,totalExpenses}=useGlobalContext()
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() =>{
        getExpenses()
    }, [])

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(expenses.map(e => e.category))];

    const handleEdit = (id) => {
        const item = expenses.find(e => e._id === id);
        if (item) {
            setEditingItem(id);
            setEditForm({
                title: item.title,
                amount: item.amount,
                category: item.category,
                description: item.description,
            });
        }
    };

    const handleEditSubmit = async () => {
        try {
            await updateExpense(editingItem, editForm);
            toast.success('Expense updated! ✅');
            setEditingItem(null);
        } catch (e) {
            toast.error('Failed to update');
        }
    };

    return (
        <ExpensesStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-income">
                    Total Expenses:<span>${totalExpenses()}</span>
                </h2>
                <div className="filter-bar">
                    <div className="search-box">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            id="expense-search"
                        />
                        {searchTerm && (
                            <button className="clear-btn" onClick={() => setSearchTerm('')}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        )}
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        id="expense-filter-category"
                        className="filter-select"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                    <span className="results-count">
                        {filteredExpenses.length} of {expenses.length} shown
                    </span>
                </div>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm/>
                    </div>
                    <div className="incomes">
                        {filteredExpenses.length === 0 && expenses.length > 0 ? (
                            <div className="no-results">
                                <i className="fa-solid fa-filter-circle-xmark"></i>
                                <p>No expenses match your filters</p>
                            </div>
                        ) : (
                            filteredExpenses.map((expense) => {
                                const {_id, title, amount, date, category, description, type, isRecurring, recurringInterval} = expense;
                                return <IncomeItem
                                    key={_id}
                                    id={_id}
                                    title={title}
                                    type={type}
                                    description={description}
                                    amount={amount}
                                    date={date}
                                    category={category}
                                    indicatorColor="var(--color-delete)"
                                    deleteItem={() => setDeleteConfirm(_id)}
                                    isRecurring={isRecurring}
                                    recurringInterval={recurringInterval}
                                    onEdit={handleEdit}
                                />
                            })
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {editingItem && (
                    <div className="edit-modal-overlay" onClick={() => setEditingItem(null)}>
                        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                            <h3><i className="fa-solid fa-pen-to-square"></i> Edit Expense</h3>
                            <div className="edit-form">
                                <input type="text" value={editForm.title || ''} onChange={(e) => setEditForm({...editForm, title: e.target.value})} placeholder="Title" />
                                <input type="number" value={editForm.amount || ''} onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})} placeholder="Amount" />
                                <input type="text" value={editForm.description || ''} onChange={(e) => setEditForm({...editForm, description: e.target.value})} placeholder="Description" />
                                <div className="edit-actions">
                                    <button className="btn-save" onClick={handleEditSubmit}>Save Changes</button>
                                    <button className="btn-cancel" onClick={() => setEditingItem(null)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </InnerLayout>

            <ConfirmModal
                isOpen={!!deleteConfirm}
                title="Delete Expense"
                message="Are you sure you want to delete this expense entry? This action cannot be undone."
                confirmText="Delete"
                danger={true}
                onConfirm={async () => {
                    await deleteExpense(deleteConfirm);
                    toast.success('Expense deleted');
                    setDeleteConfirm(null);
                }}
                onCancel={() => setDeleteConfirm(null)}
            />
        </ExpensesStyled>
    )
}

const ExpensesStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-income{
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--card-bg);
        border: 2px solid var(--card-border);
        box-shadow: 0px 1px 15px var(--shadow-color);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-delete);
        }
    }

    .filter-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }

    .search-box {
        flex: 1;
        min-width: 200px;
        position: relative;
        i {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--primary-color3);
            font-size: 0.9rem;
        }
        input {
            width: 100%;
            padding: 10px 36px 10px 40px;
            border: 2px solid var(--input-border);
            border-radius: 12px;
            font-family: 'Nunito', sans-serif;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.3s ease;
            background: var(--card-bg);
            color: var(--primary-color);
            &:focus {
                border-color: #667eea;
            }
            &::placeholder {
                color: var(--primary-color3);
            }
        }
        .clear-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--primary-color3);
            cursor: pointer;
            font-size: 0.9rem;
            padding: 4px;
            &:hover { color: var(--color-delete); }
        }
    }

    .filter-select {
        padding: 10px 14px;
        border: 2px solid var(--input-border);
        border-radius: 12px;
        font-family: 'Nunito', sans-serif;
        font-size: 0.9rem;
        outline: none;
        background: var(--card-bg);
        color: var(--primary-color);
        cursor: pointer;
        transition: border-color 0.3s ease;
        &:focus { border-color: #667eea; }
    }

    .results-count {
        font-size: 0.8rem;
        color: var(--primary-color3);
        font-weight: 600;
        white-space: nowrap;
    }

    .no-results {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--primary-color3);
        i {
            font-size: 2.5rem;
            margin-bottom: 0.8rem;
            opacity: 0.4;
        }
        p { font-size: 0.95rem; }
    }

    .income-content{
        display: flex;
        gap: 2rem;
        .incomes{
            flex: 1;
        }
    }

    .edit-modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }
    .edit-modal {
        background: var(--card-bg);
        border: 2px solid var(--card-border);
        border-radius: 20px;
        padding: 2rem;
        width: 400px;
        max-width: 90vw;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        h3 {
            color: var(--primary-color);
            margin-bottom: 1.2rem;
            display: flex;
            align-items: center;
            gap: 8px;
            i { color: #667eea; }
        }
        .edit-form {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            input {
                padding: 10px 14px;
                border: 2px solid var(--input-border);
                border-radius: 10px;
                font-family: 'Nunito', sans-serif;
                font-size: 0.95rem;
                outline: none;
                background: var(--input-bg);
                color: var(--input-text);
                &:focus { border-color: #667eea; }
            }
        }
        .edit-actions {
            display: flex;
            gap: 0.8rem;
            margin-top: 0.5rem;
            .btn-save {
                flex: 1;
                padding: 10px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border: none;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                font-family: 'Nunito', sans-serif;
                cursor: pointer;
                transition: all 0.3s;
                &:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(102,126,234,0.3); }
            }
            .btn-cancel {
                flex: 1;
                padding: 10px;
                background: var(--input-bg);
                border: 2px solid var(--input-border);
                border-radius: 10px;
                color: var(--primary-color);
                font-weight: 600;
                font-family: 'Nunito', sans-serif;
                cursor: pointer;
                transition: all 0.3s;
                &:hover { border-color: var(--color-delete); color: var(--color-delete); }
            }
        }
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
        .income-content {
            flex-direction: column;
        }
        .total-income {
            font-size: 1.3rem !important;
            span { font-size: 1.6rem !important; }
        }
        .filter-bar {
            flex-direction: column;
            align-items: stretch;
        }
        .search-box {
            min-width: 0;
        }
    }
`;

export default Expenses