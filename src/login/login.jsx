import React from 'react';
import "./login.css";

import { useNavigate } from 'react-router-dom';
import { AuthState } from "./AuthState";
import {ErrorModal} from "../modals/errorModal";

import {createClient} from '@supabase/supabase-js';

export function Login({onAuthChange}) {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = React.useState("");
    const [userPass, setUserPass] = React.useState("");
    const [showPass, setShowPass] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("null");
    const [emailError, setEmailError] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);

    const loadingRef = React.useRef(null);
    // const [userProfilePic, setUserProfilePic] = React.useState("/images/default-profile.png");

    // THIS WAS FOR TESTING PURPOSES. move to backend?
    // const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodHJieGl4cnh6bWZlZ3huaWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMDI3MTgsImV4cCI6MjA2NDU3ODcxOH0.stZvHQG6He5DHt3yhfyCtq1I5SwOhvhqVXyE5Lll3fs";
    // async function updateProfilePic() {
    //     const supabase = createClient("https://lhtrbxixrxzmfegxnihu.supabase.co", SUPABASE_ANON_KEY);

    //     // for now, just retrieves the default profile picture. Eventually, it should follow a backend login call that provides a url for profile picture
    //     const {data, error} = supabase
    //         .storage
    //         .from('profile-pictures')
    //         .getPublicUrl('default-profile.png');
    //     if (error) {
    //         console.error("Error retrieving profile picture:", error);
    //     } else {
    //         return data.publicUrl;
    //     }
    // }

    React.useEffect(() => {
        if (showLoading && loadingRef.current) {
            loadingRef.current.classList.remove('overlay-fade-out');
            loadingRef.current.classList.add('overlay-fade-in');
        }
    }, [showLoading]);


    function updateShowLoading(state) {
        if (state) {
            // going to true
            setShowLoading(true);
        } else {
            // going to false
            if (loadingRef.current) {
                console.log("properly animated out");
                loadingRef.current.classList.remove('overlay-fade-in');
                loadingRef.current.classList.add('overlay-fade-out');
            }
            setTimeout(() => setShowLoading(false), 400);
        }
    }

    async function loginUser() {
        if (!userEmail.includes("@")) {
            setEmailError(true);
            return;
        }
        setEmailError(false);
        updateShowLoading(true);


        // The Promise takes a function that has parameters resolve and reject, which are functions that can be called from the callback function
        // Resolve is called when successful, reject when it fails.
        const minLoadTime = new Promise(resolve => setTimeout(resolve, 700));
        
        // add a check to allow for an admin user to log in
        try {
            const response = await fetch('/api/auth/user/login', {
                method: 'POST',
                body: JSON.stringify({ email: userEmail, password: userPass}),
                headers: {'Content-Type': 'application/json'}
            });
            
            await minLoadTime;

            if(!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.error);
                updateShowLoading(false);
                setShowModal(true);
            } else {
                const data = await response.json();
                onAuthChange(data, AuthState.Authenticated);
                updateShowLoading(false);
                // maybe change where it navigates to?
                navigate('/about');
            }
        } catch (err) {
            await minLoadTime;
            setErrorMessage(err.toString());
            updateShowLoading(false);
            setShowModal(true);
        }        
    }


    return (
        <main className="login-main">
            {showLoading && (
                <div ref={loadingRef} className="loading-overlay-full">
                    <div className="spinner-blue"></div>
                </div>
            )}
            <div className="login-box-wrapper">
                <div className="login-title-welcome">Welcome to <span className="login-title-span">criticalfail</span></div>
                <h3 className="login-title">Login</h3>
                <div className="login-data-wrapper">
                    <div className="login-box-data">
                        <span className="login-header email-adjuster">Email</span>
                        <input className="login-input" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Enter email" />
                        {emailError && (<div className="login-error-message">Invalid Email</div>)}
                    </div>
                    <div className="login-box-data">
                        <span className="login-header password-adjuster">Password</span>
                        <input className="login-input" type={showPass ? "text" : "password"} disabled={showLoading} value={userPass} onChange={(e) => setUserPass(e.target.value)} placeholder="Enter password" 
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    loginUser();
                                }
                            }} />
                    </div>
                    <div className="show-password-box">
                        <input type="checkbox" id="show-pass" checked={showPass} onChange={() => {setShowPass(!showPass)}}/>
                        <span className="show-password-header">Show password</span>
                    </div>
                    <button type="submit" className="login-btn" onClick={() => loginUser()} disabled={!userEmail || !userPass}>Login</button>
                </div>
                <div className="divider-text">Don't have an account?</div>
                {/* create account button should take you to the create account page */}
                <button type="submit" className="create-acct-btn" onClick={() => {navigate('/createAccount')}}>Create Account</button>
                {/* this message should take you to the about page */}
                <div className="about-msg" onClick={() => {navigate('/about')}}>To learn more about criticalfail, click here.</div>
            </div>

            <ErrorModal isOpen={showModal} onClose={() => setShowModal(false)}>
                {errorMessage}
            </ErrorModal>
        </main>
    );
}