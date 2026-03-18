import {dashboard, expenses, transactions, trend} from '../Utils/icons'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: "View Transactions",
        icon: transactions,
        link: "/dashboard",
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: "/dashboard",
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: "/dashboard",
    },
    {
        id: 5,
        title: "Budgets",
        icon: <i className="fa-solid fa-piggy-bank"></i>,
        link: "/dashboard",
    },
    {
        id: 7,
        title: "Goals",
        icon: <i className="fa-solid fa-bullseye"></i>,
        link: "/dashboard",
    },
    {
        id: 6,
        title: "Settings",
        icon: <i className="fa-solid fa-cog"></i>,
        link: "/dashboard",
    },
]