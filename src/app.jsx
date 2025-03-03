import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';

export default function App() {
    return (
        <BrowserRouter>
            <header></header>
            <div>App goes here</div>
            <footer></footer>
        </BrowserRouter>
    );
}