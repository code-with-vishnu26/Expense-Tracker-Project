import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App';
import {GlobalStyles} from "./Styles/GloabalStyle";
import {GlobalProvider} from "./Context/globalContext";
import {AuthProvider} from "./Context/authContext";
import {ThemeProvider} from "./Context/ThemeContext";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

const root=ReactDom.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ErrorBoundary>
        <ThemeProvider>
            <GlobalStyles/>
            <BrowserRouter>
                <AuthProvider>
                    <GlobalProvider>
                        <App/>
                        <ToastContainer
                            position="bottom-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            pauseOnHover
                            theme="colored"
                        />
                    </GlobalProvider>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
        </ErrorBoundary>
    </React.StrictMode>
);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((reg) => console.log('SW registered:', reg.scope))
            .catch((err) => console.log('SW registration failed:', err));
    });
}