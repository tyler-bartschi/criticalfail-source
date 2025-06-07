import React from 'react';
import './app.css';

import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import {Login} from './login/login';
import {AuthState} from './login/AuthState';
import {About} from './about/about';
import {Header} from "./header/header";
import {Footer} from "./footer/footer";
import {Profile} from "./profile/profile";
import {MyStuff} from "./myStuff/myStuff";
import {Friends} from './friends/friends';
import {CreateAccount} from './createAccount/createAccount';
import {UserType} from "./UserType.js";

export default function App() {
    const [user, setUser] = React.useState(UserType.undefinedUser);
    const currentAuthState = AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    return (
        <BrowserRouter>
            <div className="body">
                {/* switch the authType to authState when finished developing */}
                <Header 
                    authType={authState}
                    user = {user} 
                    onAuthChange={(user, authState) => {
                                    setAuthState(authState);
                                    setUser(user);
                                }}
                />
                <Routes>
                    <Route path="/" element={<Login
                                                onAuthChange={(user, authState) => {
                                                    setAuthState(authState);
                                                    setUser(user)
                                                }} 
                                            />} exact />
                    {/* to properly render the header and footer in the about page, pass the authState and if its unAuthenticated, */}
                    {/* render the header and footer IN the about element, and if it's authenticated don't */}
                    {/* make a header.jsx and a footer.jsx to render those components? */}
                    <Route path="/createAccount" element={<CreateAccount
                                                            onAuthChange={(user, authState) => {
                                                                setAuthState(authState);
                                                                setUser(user)
                                                            }}
                    />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/myStuff" element={<MyStuff />} />
                    <Route path="/friends" element={<Friends />} />
                </Routes>
                {/* only adding about for now so it formats correctly */}
                {/* <About /> */}
                {/* switch the authType to authState when finished developing */}
                <Footer authType={authState}/>
            </div>
        </BrowserRouter>
    );
}

// ACTUAL CODE BELOW -- PUT THIS BACK

// {authState === AuthState.Authenticated && (
//     <header>This is authenticated header placeholder</header>
// )}
// <Routes>
//     <Route path="/" element={<Login
//                                 onAuthChange={(userName, authState) => {
//                                     setAuthState(authState);
//                                     setUserName(userName);
//                                 }} 
//                             />} exact />
//     {/* to properly render the header and footer in the about page, pass the authState and if its unAuthenticated, */}
//     {/* render the header and footer IN the about element, and if it's authenticated don't */}
//     {/* make a header.jsx and a footer.jsx to render those components? */}
//     <Route path="/about" element={<About />} />
// </Routes>
// <footer></footer>