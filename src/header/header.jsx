import React from 'react';
import "./header.css";
import {useNavigate} from 'react-router-dom';

import {AuthState} from '/src/login/AuthState';
import {ProfileInfo} from './profileInfo';
import {UserType} from "../UserType.js";

export function Header({authType, username, user, onAuthChange, profilePic}) {
    const navigate = useNavigate();

    if (authType === AuthState.Authenticated || authType === AuthState.Admin) {
        return (
            <header>
                <div className="site-title">criticalfail</div>
                <div>links to various pages</div>
                <div className="user-box">
                    <ProfileInfo 
                        user={user} 
                        globalLogout={() => {
                            onAuthChange(UserType.undefinedUser, AuthState.Unauthenticated);
                            navigate('/');
                            }}
                        profilePic={profilePic}
                    />
                </div>
            </header>
        );
    }
}