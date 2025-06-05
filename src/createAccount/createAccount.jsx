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
    const [errorMessages, setErrorMessages] = React.useState([false, false, false])

    function confirmInfo() {
        let vEmail = false;
        let vPassword = false;
        if (!userEmail.includes("@")) {
            vEmail = true;
        }
        if (password != confirmPass) {
            vPassword = true;
        }
        setErrorMessages([vEmail, false, vPassword]);
    }

    // example way to call backend and automatically parse the JSON
    // const response = await fetch('/api/data');
    // const data = await response.json();  // parses the JSON string into an object
    // console.log(data);

    // example way to handle errors and such
    // fetch('/api/register', {
    //     method: 'POST',
    //     body: JSON.stringify({ email: userEmail, password: userPass }),
    //     headers: { 'Content-Type': 'application/json' }
    // })
    // .then(async (response) => {
    //     if (!response.ok) {
    //         // For error responses like 409, parse the JSON error message
    //         const errorData = await response.json();
    //         console.error('Error:', errorData.error || errorData.msg);
    //     } else {
    //         const data = await response.json();
    //         console.log('Success:', data);
    //     }
    // })
    // .catch(err => {
    //     console.error('Fetch error:', err);
    // });



    function createUser() {
        confirmInfo()
        // call to backend here, check to see if email is taken. Username non-unique, generate unique friend code
    }

    function modulateHeight() {
        for (let i = 0; i < errorMessages.length; i++) {
            if (errorMessages[i]) {
                return true;
            }
        }
        return false;
    }

    return (
        <main className="create-main">
            <div className={`create-box-wrapper ${modulateHeight() ? "create-box-height-big" : "create-box-height-small"}`}>
                <button type="submit" className="create-back-button" onClick={() => navigate('/')}><img className="create-back-arrow" src="/images/caret-background-removed.png" /> Back</button>
                <div className='create-title'>Create an Account</div>
                <div className="create-input-field">
                    <div className="create-header">Email</div>
                    <input className="create-input" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Enter email" />
                    {errorMessages[0] && (<div className="create-error-message">Invalid email</div>)}
                    {errorMessages[1] && (<div className="create-error-message">Email already taken</div>)}
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
                    {errorMessages[2] && (<div className="create-error-message">Password does not match</div>)}
                </div>
                <div className="create-show-password-box">
                    <input type="checkbox" id="show-pass-create" checked={showPass} onChange={() => setShowPass(!showPass)} />
                    <span className="show-pass-create-header">Show password</span>
                </div>
                <button type="submit" className='create-acct-btn2' onClick={() => createUser()}>Create Account</button>
            </div>
            <div className="create-logo-display">
                <img className="logo-image" src="/images/dice-footer-image1.png" />
                <div className="logo-title">
                    criticalfail
                </div>
            </div>
        </main>
    );
}