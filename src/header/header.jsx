import React from 'react';
import "./header.css";
import {useNavigate} from 'react-router-dom';

import {AuthState} from '../login/AuthState';
import {ProfileInfo} from './profileInfo';
import {UserType} from "../UserType.js";

export function Header({authType, user, onAuthChange}) {
    const navigate = useNavigate();

    // ADD A WAY TO PERSISTENTLY STORE THE USER -- IT DEFAULTS TO UNDEFINED WHEN THE TAB IS RELOADED

    if (authType === AuthState.Authenticated || authType === AuthState.Admin) {
        return (
            <header>
                <div className="site-title">criticalfail</div>
                <div>links to various pages</div>
                <div className="user-box">
                    <ProfileInfo 
                        user={user} 
                        globalLogout={() => {
                            sessionStorage.clear("authState");
                            sessionStorage.clear('user');
                            onAuthChange(UserType.undefinedUser, AuthState.Unauthenticated);
                            navigate('/');
                            }}
                    />
                </div>
            </header>
        );
    }
}