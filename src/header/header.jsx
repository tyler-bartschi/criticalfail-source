import React from 'react';
import "./header.css";

import {AuthState} from '/src/login/AuthState';

export function Header({authType}) {
    if (authType === AuthState.Authenticated) {
        return (
            <header>
                Test header
            </header>
        );
    }
}