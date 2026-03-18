import React from "react";
import {useState, useContext} from "react";
import axios from "axios";
const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {
    const [incomes,setIncomes] = useState([]);
    const [expenses,setExpenses] = useState([]);
    const [budgets,setBudgets] = useState([]);
    const [goals,setGoals] = useState([]);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const addIncome = async (income) => {
        await axios.post(`${BASE_URL}add-income`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getIncomes()
    }
    const getIncomes = async () => {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}get-incomes`)
        setIncomes(response.data)
        setLoading(false);
    }
    const deleteIncome = async(id) =>{
        await axios.delete(`${BASE_URL}delete-income/${id}`)
        getIncomes()
    }
    const updateIncome = async (id, data) => {
        await axios.put(`${BASE_URL}update-income/${id}`, data);
        getIncomes();
    }

    const totalIncome = () =>{
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome=totalIncome+income.amount;
        })
        return totalIncome;
    }
    const addExpense = async (expense) => {
        await axios.post(`${BASE_URL}add-expense`, expense)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getExpenses()
    }
    const getExpenses = async () => {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}get-expenses`)
        setExpenses(response.data)
        setLoading(false);
    }
    const deleteExpense = async(id) =>{
        await axios.delete(`${BASE_URL}delete-expense/${id}`)
        getExpenses()
    }
    const updateExpense = async (id, data) => {
        await axios.put(`${BASE_URL}update-expense/${id}`, data);
        getExpenses();
    }

    const totalExpenses = () =>{
        let totalExpenses = 0;
        expenses.forEach((expense) =>{
            totalExpenses=totalExpenses+expense.amount;
        })
        return totalExpenses;
    }
    const totalBalance=()=>{
        return totalIncome() - totalExpenses();
    }

    const transactionHistory=()=>{
        const history=[...incomes,...expenses]
        history.sort((a,b)=>{
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        return history.slice(0, 3)
    }

    // Budget functions
    const addBudget = async (budget) => {
        const response = await axios.post(`${BASE_URL}add-budget`, budget);
        getBudgets(budget.month, budget.year);
        return response.data;
    }

    const getBudgets = async (month, year) => {
        const params = {};
        if (month) params.month = month;
        if (year) params.year = year;
        const response = await axios.get(`${BASE_URL}get-budgets`, { params });
        setBudgets(response.data);
    }

    const deleteBudget = async (id) => {
        await axios.delete(`${BASE_URL}delete-budget/${id}`);
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        getBudgets(currentMonth, currentYear);
    }

    // Goal functions
    const addGoal = async (goal) => {
        const response = await axios.post(`${BASE_URL}add-goal`, goal);
        getGoals();
        return response.data;
    }

    const getGoals = async () => {
        const response = await axios.get(`${BASE_URL}get-goals`);
        setGoals(response.data);
    }

    const updateGoal = async (id, data) => {
        const response = await axios.put(`${BASE_URL}update-goal/${id}`, data);
        getGoals();
        return response.data;
    }

    const deleteGoal = async (id) => {
        await axios.delete(`${BASE_URL}delete-goal/${id}`);
        getGoals();
    }

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            expenses,
            deleteIncome,
            updateIncome,
            totalIncome,
            addExpense,
            deleteExpense,
            updateExpense,
            getExpenses,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,setError,
            loading,
            budgets,
            addBudget,
            getBudgets,
            deleteBudget,
            goals,
            addGoal,
            getGoals,
            updateGoal,
            deleteGoal
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}