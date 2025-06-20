import React from 'react';
import "./header.css";
import {useNavigate} from 'react-router-dom';

import {AuthState} from '../authentication/login/AuthState.js';
import {ProfileInfo} from './profileInfo';
import {UserType} from "../UserType.js";

export function Header({authType, user, onAuthChange}) {
    const navigate = useNavigate();

    if (authType === AuthState.Authenticated || authType === AuthState.Admin) {
        return (
            <header>
                <div className="site-title" onClick={() => navigate("/home")}>criticalfail</div>
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