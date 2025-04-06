import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import {Login} from './login/login';
import {AuthState} from './login/AuthState';

export default function App() {
    const [userName, setUserName] = React.useState("");
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    return (
        <BrowserRouter>
            <div className="body">
                {authState === AuthState.Authenticated && (
                    <header>This is authenticated header placeholder</header>
                )}
                <Routes>
                    <Route path="/" element={<Login
                                                onAuthChange={(userName, authState) => {
                                                    setAuthState(authState);
                                                    setUserName(userName);
                                                }} 
                                            />} exact />
                </Routes>
                <footer></footer>
            </div>
        </BrowserRouter>
    );
}