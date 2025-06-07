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


    async function loginUser() {
        // add a check to allow for an admin user to log in
        const response = await fetch('/api/auth/user/login', {
            method: 'POST',
            body: JSON.stringify({ email: userEmail, password: userPass}),
            headers: {'Content-Type': 'application/json'}
        });

        if(!response.ok) {
            const errorData = await response.json();
            setErrorMessage(errorData.error);
            setShowModal(true);
        } else {
            const data = await response.json();
            onAuthChange(data, AuthState.Authenticated);
            // maybe change where it navigates to?
            navigate('/about');
        }
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
                        <input className="login-input" type={showPass ? "text" : "password"} value={userPass} onChange={(e) => setUserPass(e.target.value)} placeholder="Enter password" 
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