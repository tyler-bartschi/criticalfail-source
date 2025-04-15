import React from 'react';
import './createAccount.css';
import {useNavigate} from "react-router-dom";

export function CreateAccount() {
    const navigate = useNavigate();

    return (
        <main className="create-main">
            <div className="create-box-wrapper">
                <button type="submit" className="create-back-button" onClick={() => navigate('/')}><img className="create-back-arrow" src="/images/caret-background-removed.png" /> Back</button>
                <div className='create-title'>Create an Account</div>
            </div>
        </main>
    );
}