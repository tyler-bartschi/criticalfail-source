import React from 'react';
import "./header.css";
import {useNavigate} from 'react-router-dom';

import {AuthState} from '/src/login/AuthState';
import {ProfileInfo} from './profileInfo';

export function Header({authType, username}) {
    const navigate = useNavigate();

    if (authType === AuthState.Authenticated) {
        return (
            <header>
                <div className="site-title">criticalfail</div>
                <div>links to various pages</div>
                <div className="user-box">
                    <ProfileInfo username={username}/>
                </div>
            </header>
        );
    }
}