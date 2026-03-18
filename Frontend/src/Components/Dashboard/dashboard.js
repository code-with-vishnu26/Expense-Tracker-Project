import React, {useState} from "react";
import styled from "styled-components";
import {InnerLayout} from "../../Styles/layout";
import {IncomeExpenseChart, ExpenseCategoryChart, MonthlyBarChart} from "../Chart/chart";
import {useGlobalContext} from "../../Context/globalContext";
import {useAuth} from "../../Context/authContext";
import {useEffect} from "react";
import History from "../History/history";
import { DashboardSkeleton } from "../Skeleton/SkeletonLoader";

function Dashboard() {
    const {totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses, budgets, getBudgets, loading} = useGlobalContext()
    const {user} = useAuth()
    const [dateRange, setDateRange] = useState('all');

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        getIncomes()
        getExpenses()
        getBudgets(currentMonth, currentYear)
    }, [])

    const isFirstLoad = loading && incomes.length === 0 && expenses.length === 0;

    const currency = user?.currency || '$';
    const now = new Date();

    // Date range filter
    const getFilteredDate = () => {
        const d = new Date();
        switch(dateRange) {
            case 'month': d.setMonth(d.getMonth() - 1); return d;
            case '3months': d.setMonth(d.getMonth() - 3); return d;
            case 'year': d.setFullYear(d.getFullYear() - 1); return d;
            default: return null;
        }
    };

    const filterDate = getFilteredDate();
    const filteredIncomes = filterDate ? incomes.filter(i => new Date(i.date) >= filterDate) : incomes;
    const filteredExpenses = filterDate ? expenses.filter(e => new Date(e.date) >= filterDate) : expenses;

    const income = filteredIncomes.reduce((sum, i) => sum + i.amount, 0);
    const expense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = income - expense;
    const savingsRate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;

    // This month's data
    const thisMonthIncome = incomes
        .filter(i => {
            const d = new Date(i.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, i) => sum + i.amount, 0);

    const thisMonthExpense = expenses
        .filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, e) => sum + e.amount, 0);

    // Top spending category
    const categoryMap = {};
    filteredExpenses.forEach(e => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

    // Transaction count
    const totalTransactions = filteredIncomes.length + filteredExpenses.length;

    // Budget Alerts — calculate for dashboard banner
    const budgetAlerts = budgets.map(budget => {
        const spent = expenses
            .filter(e => {
                const d = new Date(e.date);
                return e.category === budget.category && d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
            })
            .reduce((sum, e) => sum + e.amount, 0);
        const pct = (spent / budget.amount) * 100;
        return { ...budget, spent, pct };
    }).filter(b => b.pct >= 80);

    // Bill Reminders - upcoming recurring expenses (next 7 days)
    const upcomingBills = expenses.filter(e => {
        if (!e.isRecurring) return false;
        const lastDate = new Date(e.date);
        let nextDue = new Date(lastDate);
        while (nextDue <= now) {
            switch(e.recurringInterval) {
                case 'daily': nextDue.setDate(nextDue.getDate() + 1); break;
                case 'weekly': nextDue.setDate(nextDue.getDate() + 7); break;
                case 'monthly': nextDue.setMonth(nextDue.getMonth() + 1); break;
                case 'yearly': nextDue.setFullYear(nextDue.getFullYear() + 1); break;
                default: nextDue.setMonth(nextDue.getMonth() + 1);
            }
        }
        const daysUntil = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
        e._nextDue = nextDue;
        e._daysUntil = daysUntil;
        return daysUntil <= 7;
    }).sort((a, b) => a._daysUntil - b._daysUntil);

    const monthName = now.toLocaleString('default', {month: 'long'});

    return (
        <DashboardStyled>
            <InnerLayout>
                {isFirstLoad ? <DashboardSkeleton /> : <>
                <div className="dashboard-header">
                    <div>
                        <h2>Dashboard</h2>
                        <p className="greeting">Welcome back, <span>{user?.name || 'User'}</span> 👋</p>
                    </div>
                    <div className="header-right">
                        <select
                            className="date-range-select"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            id="dashboard-date-range"
                        >
                            <option value="all">All Time</option>
                            <option value="month">This Month</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="year">This Year</option>
                        </select>
                        <div className="month-indicator">
                            <i className="fa-solid fa-calendar"></i>
                            {monthName} {now.getFullYear()}
                        </div>
                    </div>
                </div>

                {/* Budget Alert Banners */}
                {budgetAlerts.length > 0 && (
                    <div className="budget-alerts">
                        {budgetAlerts.map(alert => {
                            const catName = alert.category.charAt(0).toUpperCase() + alert.category.slice(1);
                            const isOver = alert.pct >= 100;
                            return (
                                <div className={`alert-banner ${isOver ? 'alert-danger' : 'alert-warning'}`} key={alert._id}>
                                    <div className="alert-icon">
                                        <i className={`fa-solid ${isOver ? 'fa-triangle-exclamation' : 'fa-circle-exclamation'}`}></i>
                                    </div>
                                    <div className="alert-text">
                                        <strong>{isOver ? '🚨 Over Budget' : '⚠️ Budget Warning'}</strong>
                                        <span>{catName}: {currency}{alert.spent.toFixed(0)} / {currency}{alert.amount.toFixed(0)} ({alert.pct.toFixed(0)}%)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* KPI Cards Row */}
                <div className="kpi-row">
                    <div className="kpi-card income-card">
                        <div className="kpi-icon"><i className="fa-solid fa-arrow-trend-up"></i></div>
                        <div className="kpi-info">
                            <span className="kpi-label">Total Income</span>
                            <h3>{currency}{income.toLocaleString()}</h3>
                            <span className="kpi-sub"><i className="fa-solid fa-calendar-day"></i> This month: {currency}{thisMonthIncome.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="kpi-card expense-card">
                        <div className="kpi-icon expense-icon"><i className="fa-solid fa-arrow-trend-down"></i></div>
                        <div className="kpi-info">
                            <span className="kpi-label">Total Expenses</span>
                            <h3>{currency}{expense.toLocaleString()}</h3>
                            <span className="kpi-sub"><i className="fa-solid fa-calendar-day"></i> This month: {currency}{thisMonthExpense.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="kpi-card balance-card">
                        <div className="kpi-icon balance-icon"><i className="fa-solid fa-wallet"></i></div>
                        <div className="kpi-info">
                            <span className="kpi-label">Net Balance</span>
                            <h3 className={balance >= 0 ? 'positive' : 'negative'}>{balance >= 0 ? '+' : ''}{currency}{balance.toLocaleString()}</h3>
                            <span className="kpi-sub"><i className="fa-solid fa-piggy-bank"></i> Savings rate: {savingsRate}%</span>
                        </div>
                    </div>
                    <div className="kpi-card stats-card">
                        <div className="kpi-icon stats-icon"><i className="fa-solid fa-chart-pie"></i></div>
                        <div className="kpi-info">
                            <span className="kpi-label">Quick Stats</span>
                            <h3>{totalTransactions} <small>txns</small></h3>
                            <span className="kpi-sub"><i className="fa-solid fa-fire"></i> Top: {topCategory ? topCategory[0] : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="charts-row">
                    <div className="chart-card chart-wide">
                        <div className="chart-title"><h3><i className="fa-solid fa-chart-line"></i> Income vs Expense Trend</h3></div>
                        <div className="chart-body"><IncomeExpenseChart /></div>
                    </div>
                    <div className="chart-card chart-narrow">
                        <div className="chart-title"><h3><i className="fa-solid fa-chart-pie"></i> Spending Categories</h3></div>
                        <div className="chart-body doughnut-body">
                            {expenses.length > 0 ? <ExpenseCategoryChart /> : (
                                <div className="empty-chart"><i className="fa-solid fa-receipt"></i><p>No expenses yet</p></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="charts-row">
                    <div className="chart-card chart-wide">
                        <div className="chart-title"><h3><i className="fa-solid fa-chart-bar"></i> Monthly Overview ({now.getFullYear()})</h3></div>
                        <div className="chart-body"><MonthlyBarChart /></div>
                    </div>
                    <div className="chart-card chart-narrow">
                        <div className="chart-title"><h3><i className="fa-solid fa-clock-rotate-left"></i> Recent Activity</h3></div>
                        <div className="history-body">
                            <History />
                            {incomes.length > 0 && (
                                <div className="minmax-section">
                                    <div className="minmax-header"><i className="fa-solid fa-money-bill-trend-up"></i> Income Range</div>
                                    <div className="minmax-values">
                                        <span className="min-val">{currency}{Math.min(...incomes.map(i => i.amount)).toLocaleString()}</span>
                                        <div className="minmax-bar"><div className="minmax-fill income-fill"></div></div>
                                        <span className="max-val">{currency}{Math.max(...incomes.map(i => i.amount)).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                            {expenses.length > 0 && (
                                <div className="minmax-section">
                                    <div className="minmax-header"><i className="fa-solid fa-money-bill-transfer"></i> Expense Range</div>
                                    <div className="minmax-values">
                                        <span className="min-val">{currency}{Math.min(...expenses.map(e => e.amount)).toLocaleString()}</span>
                                        <div className="minmax-bar"><div className="minmax-fill expense-fill"></div></div>
                                        <span className="max-val">{currency}{Math.max(...expenses.map(e => e.amount)).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bill Reminders */}
                {upcomingBills.length > 0 && (
                    <div className="bill-reminders">
                        <h3><i className="fa-solid fa-bell"></i> Upcoming Bills</h3>
                        <div className="reminder-cards">
                            {upcomingBills.map((bill, idx) => (
                                <div className={`reminder-card ${bill._daysUntil <= 1 ? 'urgent' : ''}`} key={idx}>
                                    <div className="reminder-icon"><i className="fa-solid fa-receipt"></i></div>
                                    <div className="reminder-info">
                                        <strong>{bill.title}</strong>
                                        <span>{currency}{bill.amount} · {bill.recurringInterval}</span>
                                    </div>
                                    <div className="reminder-due">
                                        {bill._daysUntil <= 1 ? (
                                            <span className="due-badge today">Today!</span>
                                        ) : (
                                            <span className="due-badge">{bill._daysUntil}d</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                </>}
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    .dashboard-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;
        h2 { font-size:1.8rem; color:var(--primary-color); }
        .greeting { color:var(--primary-color3); font-size:0.95rem; margin-top:0.2rem; span { font-weight:700; color:var(--primary-color2); } }
        .header-right { display:flex; align-items:center; gap:1rem; }
        .date-range-select { padding:8px 14px; border:2px solid var(--card-border); border-radius:12px; background:var(--card-bg); color:var(--primary-color); font-family:'Nunito',sans-serif; font-size:0.85rem; font-weight:600; outline:none; cursor:pointer; transition:border-color 0.3s; &:focus { border-color:#667eea; } }
        .month-indicator { background:linear-gradient(135deg,#667eea,#764ba2); color:white; padding:8px 16px; border-radius:12px; font-size:0.85rem; font-weight:600; display:flex; align-items:center; gap:6px; i { font-size:0.9rem; } }
    }

    /* Budget Alert Banners */
    .budget-alerts { display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.2rem; }
    .alert-banner { display:flex; align-items:center; gap:1rem; padding:0.8rem 1.2rem; border-radius:14px; animation:slideIn 0.4s ease-out; }
    .alert-danger { background:rgba(255,71,87,0.1); border:1.5px solid rgba(255,71,87,0.3); .alert-icon i { color:#ff4757; } }
    .alert-warning { background:rgba(255,165,2,0.1); border:1.5px solid rgba(255,165,2,0.3); .alert-icon i { color:#ffa502; } }
    .alert-icon { font-size:1.3rem; flex-shrink:0; }
    .alert-text { display:flex; flex-direction:column; strong { font-size:0.85rem; color:var(--primary-color); } span { font-size:0.8rem; color:var(--primary-color2); } }
    @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }

    /* KPI Cards */
    .kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
    .kpi-card { background:var(--card-bg); border:2px solid var(--card-border); box-shadow:0px 1px 15px var(--shadow-color); border-radius:16px; padding:1.2rem; display:flex; align-items:center; gap:1rem; transition:transform 0.2s ease,box-shadow 0.2s ease; &:hover { transform:translateY(-3px); box-shadow:0px 5px 25px rgba(0,0,0,0.1); } }
    .kpi-icon { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; color:white; flex-shrink:0; background:linear-gradient(135deg,#2ed573,#7bed9f); }
    .expense-icon { background:linear-gradient(135deg,#ff4757,#ff6b81); }
    .balance-icon { background:linear-gradient(135deg,#667eea,#764ba2); }
    .stats-icon { background:linear-gradient(135deg,#ffa502,#fdcb6e); }
    .kpi-info { flex:1; min-width:0;
        .kpi-label { font-size:0.75rem; color:var(--primary-color3); font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
        h3 { font-size:1.4rem; color:var(--primary-color); margin:2px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; small { font-size:0.8rem; color:var(--primary-color2); } }
        .positive { color:#2ed573; } .negative { color:#ff4757; }
        .kpi-sub { font-size:0.75rem; color:var(--primary-color3); display:flex; align-items:center; gap:4px; i { font-size:0.7rem; } }
    }

    /* Charts */
    .charts-row { display:grid; grid-template-columns:3fr 2fr; gap:1rem; margin-bottom:1.5rem; }
    .chart-card { background:var(--card-bg); border:2px solid var(--card-border); box-shadow:0px 1px 15px var(--shadow-color); border-radius:20px; padding:1.2rem; transition:transform 0.2s ease; &:hover { transform:translateY(-2px); } }
    .chart-title { margin-bottom:0.8rem; h3 { font-size:0.95rem; color:var(--primary-color); display:flex; align-items:center; gap:8px; i { color:#667eea; font-size:1rem; } } }
    .chart-body { height:280px; position:relative; }
    .doughnut-body { height:260px; display:flex; align-items:center; justify-content:center; }
    .empty-chart { text-align:center; color:var(--primary-color3); i { font-size:2.5rem; margin-bottom:0.5rem; opacity:0.4; } p { font-size:0.9rem; } }
    .history-body { max-height:340px; overflow-y:auto; padding-right:4px; &::-webkit-scrollbar { width:4px; } &::-webkit-scrollbar-thumb { background:rgba(34,34,96,0.15); border-radius:10px; } }

    /* Min/Max */
    .minmax-section { margin-top:0.8rem;
        .minmax-header { font-size:0.8rem; font-weight:600; color:var(--primary-color2); margin-bottom:0.3rem; display:flex; align-items:center; gap:6px; i { font-size:0.85rem; color:#667eea; } }
        .minmax-values { display:flex; align-items:center; gap:8px; .min-val,.max-val { font-size:0.8rem; font-weight:700; color:var(--primary-color); white-space:nowrap; } }
        .minmax-bar { flex:1; height:6px; background:#e8e8e8; border-radius:10px; overflow:hidden; .minmax-fill { height:100%; border-radius:10px; width:100%; } .income-fill { background:linear-gradient(90deg,#2ed573,#7bed9f); } .expense-fill { background:linear-gradient(90deg,#ff4757,#ff6b81); } }
    }

    /* Bill Reminders */
    .bill-reminders { margin-top:1.5rem;
        h3 { color:var(--primary-color); font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:8px; i { color:#ffa502; } }
        .reminder-cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1rem; }
        .reminder-card { display:flex; align-items:center; gap:1rem; background:var(--card-bg); border:2px solid var(--card-border); border-radius:14px; padding:1rem; transition:all 0.2s ease;
            &.urgent { border-color:rgba(255,71,87,0.4); animation:pulse-danger 2s ease-in-out infinite; }
            .reminder-icon { width:40px; height:40px; background:rgba(255,165,2,0.1); border-radius:10px; display:flex; align-items:center; justify-content:center; i { color:#ffa502; font-size:1rem; } }
            .reminder-info { flex:1; strong { display:block; color:var(--primary-color); font-size:0.9rem; } span { font-size:0.8rem; color:var(--primary-color3); text-transform:capitalize; } }
            .due-badge { padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:700; background:rgba(102,126,234,0.1); color:#667eea; &.today { background:rgba(255,71,87,0.1); color:#ff4757; } }
        }
    }

    @keyframes pulse-danger { 0%,100% { box-shadow:0px 1px 15px var(--shadow-color); } 50% { box-shadow:0 0 20px rgba(255,71,87,0.15); } }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
        .dashboard-header { flex-direction:column; gap:0.8rem; .header-right { width:100%; flex-wrap:wrap; } .date-range-select { flex:1; min-width:0; } .month-indicator { font-size:0.8rem; padding:6px 12px; } }
        .kpi-row { grid-template-columns:repeat(2,1fr); gap:0.8rem; }
        .kpi-card { padding:1rem 0.8rem; }
        .kpi-icon { width:40px; height:40px; font-size:1rem; }
        .kpi-info h3 { font-size:1.1rem; }
        .charts-row { grid-template-columns:1fr; }
        .chart-body { height:220px; }
        .doughnut-body { height:200px; }
        .bill-reminders .reminder-cards { grid-template-columns:1fr; }
        .budget-alerts .alert-banner { padding:0.6rem 0.8rem; }
    }
    @media (max-width: 480px) {
        .kpi-row { grid-template-columns:1fr; }
        .dashboard-header h2 { font-size:1.4rem; }
    }
`;

export default Dashboard