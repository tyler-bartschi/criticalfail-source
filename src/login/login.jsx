import React from 'react';
import "./login.css";

import { useNavigate } from 'react-router-dom';
import { AuthState } from "./AuthState";

export function Login({onAuthChange}) {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = React.useState("");
    const [userPass, setUserPass] = React.useState("");
    const [showPass, setShowPass] = React.useState(false);
    const [userProfilePic, setUserProfilePic] = React.useState("/images/default-profile.png");
    const [username, setUsername] = React.useState("");

    async function loginUser() {
        // needs to do something to change the authstate to authenticated, so the user can see everything else

        // add a check to allow for an admin user to log in
        console.log("Temp");
        // userEmail should eventually be changed to username
        onAuthChange(userEmail, userProfilePic, AuthState.Authenticated);
        navigate("/about");
    }


    return (
        <main className="login-main">
            <div className="login-box-wrapper">
                <div className="login-title-welcome">Welcome to <span className="login-title-span">criticalfail</span></div>
                <h3 className="login-title">Login</h3>
                <div className="login-data-wrapper">
                    <div className="login-box-data">
                        <span className="login-header email-adjuster">Email</span>
                        <input className="login-input" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Enter email" />
                    </div>
                    <div className="login-box-data">
                        <span className="login-header password-adjuster">Password</span>
                        <input className="login-input" type={showPass ? "text" : "password"} value={userPass} onChange={(e) => setUserPass(e.target.value)} placeholder="Enter password" />
                    </div>
                    <div className="show-password-box">
                        <input type="checkbox" id="show-pass" checked={showPass} onChange={() => {setShowPass(!showPass)}}/>
                        <span className="show-password-header">Show password</span>
                    </div>
                    <button type="submit" className="login-btn" onClick={() => loginUser()} disabled={!userEmail || !userPass}>Login</button>
                </div>
                <div className="divider-text">Don't have an account?</div>
                {/* create account button should take you to the create account page */}
                <button type="submit" className="create-acct-btn" onClick={() => {}}>Create Account</button>
                {/* this message should take you to the about page */}
                <div className="about-msg" onClick={() => {navigate('/about')}}>To learn more about criticalfail, click here.</div>
            </div>
        </main>
    );
}