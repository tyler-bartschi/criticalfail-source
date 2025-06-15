import React from 'react';
// DO NOT REMOVE BOOTSTRAP IMPORTS - IT SCREWS EVERYTHING UP
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

import {BrowserRouter, NavLink, Route, Routes, useNavigate} from 'react-router-dom';
import {Login} from './login/login';
import {AuthState} from './login/AuthState';
import {About} from './about/about';
import {Header} from "./header/header";
import {Footer} from "./footer/footer";
import {Profile} from "./profile/profile";
import {MyStuff} from "./myStuff/myStuff";
import {Friends} from './friends/friends';
import {CreateAccount} from './createAccount/createAccount';
import {Home} from "./home/home";
import {UserType} from "./UserType.js";

export default function App() {
    const [user, setUser] = React.useState(() => {
        const value = sessionStorage.getItem('user');
        if (value) {
            return JSON.parse(value);
        } else {
            return UserType.undefinedUser;
        }
    });
    
    // const currentAuthState = AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(() => {
        const value = sessionStorage.getItem("authState");
        if (value === "authenticated") {
            return AuthState.Authenticated;
        } else if (value === "unauthenticated") {
            return AuthState.Unauthenticated;
        } else if (value === "admin") {
            return AuthState.Admin;
        }else {
            return AuthState.Unauthenticated;
        }
    });

    function authChange(user, authState) {
        setAuthState(authState);
        setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('authState', authState.name);
    }

    return (
        <BrowserRouter>
            <div className="body">
                {/* switch the authType to authState when finished developing */}
                <Header 
                    authType={authState}
                    user = {user} 
                    onAuthChange={authChange}
                />
                <Routes>
                    <Route path="/" element={<Login
                                                onAuthChange={authChange} 
                                            />} exact />
                    {/* to properly render the header and footer in the about page, pass the authState and if its unAuthenticated, */}
                    {/* render the header and footer IN the about element, and if it's authenticated don't */}
                    {/* make a header.jsx and a footer.jsx to render those components? */}
                    <Route path="/createAccount" element={<CreateAccount
                                                            onAuthChange={authChange}
                    />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About authType={authState}/>} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/myStuff" element={<MyStuff />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                {/* only adding about for now so it formats correctly */}
                {/* <About /> */}
                {/* switch the authType to authState when finished developing */}
                <Footer authType={authState}/>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="not-found">
            <div className="not-found-header">criticalfail</div>
            <div className="not-found-wrapper">
                <div className="not-found-title">Error: 404</div>
                <div className="not-found-message">Page not found.</div>
                <div className="not-found-back" onClick={() => navigate('/')} >Back to Login</div>  
            </div>
        </div>
    );
}