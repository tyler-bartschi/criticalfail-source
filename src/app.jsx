import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import {Login} from './login/login';
import {AuthState} from './login/AuthState';
import {About} from './about/about';
import {Header} from "./header/header";
import {Footer} from "./footer/footer";

export default function App() {
    const [userName, setUserName] = React.useState("");
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    return (
        <BrowserRouter>
            <div className="body">
                <Header authType={authState} />
                {/* <div>TEST: HEADER AND FOOTER IN DEVELOPMENT</div> */}
                <Routes>
                    <Route path="/" element={<Login
                                                onAuthChange={(userName, authState) => {
                                                    setAuthState(authState);
                                                    setUserName(userName);
                                                }} 
                                            />} exact />
                    {/* to properly render the header and footer in the about page, pass the authState and if its unAuthenticated, */}
                    {/* render the header and footer IN the about element, and if it's authenticated don't */}
                    {/* make a header.jsx and a footer.jsx to render those components? */}
                    <Route path="/about" element={<About />} />
                </Routes>
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