import React from 'react';
import './createAccount.css';
import {useNavigate} from "react-router-dom";

export function CreateAccount() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = React.useState("")
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPass, setConfirmPass] = React.useState("");
    const [showPass, setShowPass] = React.useState(false);

    return (
        <main className="create-main">
            <div className="create-box-wrapper">
                <button type="submit" className="create-back-button" onClick={() => navigate('/')}><img className="create-back-arrow" src="/images/caret-background-removed.png" /> Back</button>
                <div className='create-title'>Create an Account</div>
                <div className="create-input-field">
                    <div className="create-header">Email</div>
                    <input className="create-input" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Enter email" />
                </div>
                <div className="create-input-field">
                    <div className="create-header">Username</div>
                    <input className="create-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
                </div>
                <div className="create-input-field">
                    <div className="create-header">Password</div>
                    <input className="create-input" type={showPass ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                </div>
                <div className="create-input-field">
                    <div className="create-header">Confirm Password</div>
                    <input className="create-input" type={showPass ? "text" : "password"} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm password" />
                </div>
                <div className="create-show-password-box">
                    <input type="checkbox" id="show-pass-create" checked={showPass} onChange={() => setShowPass(!showPass)} />
                    <span className="show-pass-create-header">Show password</span>
                </div>
                <button type="submit" className='create-acct-btn2' onClick={() => console.log("I will do something eventually!")}>Create Account</button>
            </div>
        </main>
    );
}


// <div className="show-password-box">
// <input type="checkbox" id="show-pass" checked={showPass} onChange={() => {setShowPass(!showPass)}}/>
// <span className="show-password-header">Show password</span>
// </div>