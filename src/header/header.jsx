import React from 'react';
import "./header.css";

import {AuthState} from '/src/login/AuthState';

export function Header({authType}) {
    if (authType === AuthState.Authenticated) {
        return (
            <header>
                <div className="site-title">criticalfail</div>
                <div>links to various pages</div>
                <div className="user-box">put username component here</div>
            </header>
        );
    }
}