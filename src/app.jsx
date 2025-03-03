import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import {Login} from './login/login';

export default function App() {
    return (
        <BrowserRouter>
            <header></header>
            <Routes>
                <Route path="/" element={<Login />} exact />
            </Routes>
            <footer></footer>
        </BrowserRouter>
    );
}