import React from 'react';
import './footer.css';

import {AuthState} from "/src/login/AuthState";

export function Footer({authType}) {
    if (authType === AuthState.Authenticated) { 
        return (
            <div>Test footer</div>
        );
    }
}