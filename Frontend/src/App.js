import styled from "styled-components";
import bg from "./img/bg.png";
import {MainLayout} from "./Styles/layout";
import Orb from "./Components/Orb/orb";
import Navigation from "./Components/Navigation/navigation";
import React from "react";
import { useMemo,useState } from "react"
import Dashboard from "./Components/Dashboard/dashboard";
import Expenses from "./Components/Expenses/expenses";
import Incomes from "./Components/Incomes/incomes";
import Budgets from "./Components/Budgets/Budgets";
import Goals from "./Components/Goals/Goals";
import Settings from "./Components/Settings/Settings";
import History from "./Components/History/history";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import {useAuth} from "./Context/authContext";
import {Routes, Route, Navigate} from "react-router-dom";
import NotFound from "./Components/NotFound/NotFound";

function ProtectedApp() {
    const[active, setActive] = useState(1);
    const orbMemo=useMemo(()=>{
        return <Orb/>
    },[])

    const displayData=()=>{
        switch(active){
            case 1:
                return <Dashboard/>
            case 2:
                return <History/>
            case 3:
                return <Incomes/>
            case 4:
                return <Expenses/>
            case 5:
                return <Budgets/>
            case 7:
                return <Goals/>
            case 6:
                return <Settings/>
            default:
                return <Dashboard/>
        }
    }

    return (
        <AppStyled bg={bg} className="App">
            {orbMemo}
            <MainLayout>
                <Navigation active={active} setActive={setActive} />
                <main>
                    {displayData()}
                </main>
            </MainLayout>
        </AppStyled>
    );
}

function App(){
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <LoadingStyled>
                <div className="loader">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </LoadingStyled>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login/>} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register/>} />
            <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword/>} />
            <Route path="/reset-password/:token" element={user ? <Navigate to="/" /> : <ResetPassword/>} />
            <Route path="/" element={user ? <ProtectedApp/> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

const LoadingStyled = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    .loader {
        text-align: center;
        p {
            color: rgba(255,255,255,0.6);
            margin-top: 1rem;
            font-size: 1.1rem;
        }
    }
    .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255,255,255,0.1);
        border-top-color: #667eea;
        border-radius: 50%;
        margin: 0 auto;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const AppStyled=styled.div`
    height: 100vh;
    background-image: url(${props => props.bg});
    position:relative;
    main{
        flex: 1;
        background: var(--main-bg);
        border: 3px solid var(--main-border);
        backdrop-filter: blur(4.5px);
        border-radius: 32px;
        overflow-x: hidden;
        &::-webkit-scrollbar{
            width: 0;
        }
    }
`;
export default App;