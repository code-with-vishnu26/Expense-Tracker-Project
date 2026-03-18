import React from 'react'
import {Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    Filler,
} from 'chart.js'

import {Line, Doughnut, Bar} from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../Context/globalContext'
import { dateFormat } from '../../Utils/dateFormat'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
)

// Income vs Expense trend line
export function IncomeExpenseChart() {
    const {incomes, expenses} = useGlobalContext()

    // Merge dates and sort
    const allDates = [...new Set([
        ...incomes.map(i => dateFormat(i.date)),
        ...expenses.map(e => dateFormat(e.date))
    ])].sort((a, b) => new Date(a) - new Date(b)).slice(-10);

    const data = {
        labels: allDates,
        datasets: [
            {
                label: "Income",
                data: allDates.map(date => {
                    return incomes
                        .filter(i => dateFormat(i.date) === date)
                        .reduce((sum, i) => sum + i.amount, 0)
                }),
                borderColor: '#2ed573',
                backgroundColor: 'rgba(46, 213, 115, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#2ed573',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
            {
                label: "Expense",
                data: allDates.map(date => {
                    return expenses
                        .filter(e => dateFormat(e.date) === date)
                        .reduce((sum, e) => sum + e.amount, 0)
                }),
                borderColor: '#ff4757',
                backgroundColor: 'rgba(255, 71, 87, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ff4757',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: { family: 'Nunito', size: 12, weight: '600' }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(34, 34, 96, 0.9)',
                titleFont: { family: 'Nunito' },
                bodyFont: { family: 'Nunito' },
                padding: 12,
                cornerRadius: 10,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Nunito', size: 11 } }
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    font: { family: 'Nunito', size: 11 },
                    callback: (val) => '$' + val
                }
            }
        }
    }

    return <Line data={data} options={options} />
}

// Expense Category Doughnut
export function ExpenseCategoryChart() {
    const {expenses} = useGlobalContext()

    const categoryMap = {};
    expenses.forEach(e => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const colors = [
        '#667eea', '#f093fb', '#2ed573', '#ffa502',
        '#ff4757', '#1e90ff', '#a29bfe', '#fd79a8',
        '#00cec9', '#fdcb6e'
    ];

    const data = {
        labels: Object.keys(categoryMap).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        datasets: [{
            data: Object.values(categoryMap),
            backgroundColor: colors.slice(0, Object.keys(categoryMap).length),
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 8,
        }]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 12,
                    font: { family: 'Nunito', size: 11, weight: '600' }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(34, 34, 96, 0.9)',
                titleFont: { family: 'Nunito' },
                bodyFont: { family: 'Nunito' },
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: (ctx) => ` $${ctx.parsed.toLocaleString()}`
                }
            }
        }
    }

    return <Doughnut data={data} options={options} />
}

// Monthly Bar chart
export function MonthlyBarChart() {
    const {incomes, expenses} = useGlobalContext()

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const currentYear = new Date().getFullYear();

    const monthlyIncome = new Array(12).fill(0);
    const monthlyExpense = new Array(12).fill(0);

    incomes.forEach(i => {
        const d = new Date(i.date);
        if (d.getFullYear() === currentYear) {
            monthlyIncome[d.getMonth()] += i.amount;
        }
    });

    expenses.forEach(e => {
        const d = new Date(e.date);
        if (d.getFullYear() === currentYear) {
            monthlyExpense[d.getMonth()] += e.amount;
        }
    });

    const data = {
        labels: months,
        datasets: [
            {
                label: 'Income',
                data: monthlyIncome,
                backgroundColor: 'rgba(46, 213, 115, 0.7)',
                borderRadius: 6,
                borderSkipped: false,
            },
            {
                label: 'Expense',
                data: monthlyExpense,
                backgroundColor: 'rgba(255, 71, 87, 0.7)',
                borderRadius: 6,
                borderSkipped: false,
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: { family: 'Nunito', size: 12, weight: '600' }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(34, 34, 96, 0.9)',
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Nunito', size: 11 } }
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    font: { family: 'Nunito', size: 11 },
                    callback: (val) => '$' + val
                }
            }
        }
    }

    return <Bar data={data} options={options} />
}

// Keep backward compatibility
function Chart() {
    return (
        <ChartStyled>
            <IncomeExpenseChart />
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
`;

export default Chart