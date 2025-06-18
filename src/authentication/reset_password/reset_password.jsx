import React from 'react';
import "./reset_password.css";

import {useNavigate} from 'react-router-dom';

export function ResetPassword() {
    const navigate = useNavigate();
    return (
        <main className="reset-main">
            <div className="reset-body-wrapper">
                <button type="submit" className="reset-back-button" onClick={() => navigate('/')}><img className="reset-back-arrow" src="/images/caret-background-removed.png"/>Back</button>
                <div>Reset Password</div>
                <div>Enter email here</div>
            </div>
            <div></div>
        </main>
    );
}