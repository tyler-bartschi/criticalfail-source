import React from 'react';
import "./login.css";

import { AuthState } from "./AuthState";

export function Login() {
    const [userEmail, setUserEmail] = React.useState(localStorage.getItem('userEmail' || ""));
    const [userPass, setUserPass] = React.useState("");

    return (
        <main className="login-main">
            <div className="login-box-wrapper">
                <div className="login-title-welcome">Welcome to <span className="login-title-span">criticalfail</span></div>
                <div className="login-data-wrapper">
                    <div className="login-email-data">
                        <span className="login-email-header">Email</span>
                        <input className="login-email-input" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Enter email" />
                    </div>
                    <div className="login-password-data">
                        <span className="login-password-header">Password</span>
                        <input className="login-password-input" type="password" value={userPass} onChange={(e) => setUserPass(e.target.value)} placeholder="Enter password" />
                    </div>
                </div>
            </div>
            
        </main>
    );
}