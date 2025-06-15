import React from 'react';
import './createAccount.css';
import {useNavigate} from "react-router-dom";
import {ErrorModal} from '../modals/errorModal';
import {AuthState} from "../login/AuthState";

export function CreateAccount({onAuthChange}) {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = React.useState("")
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPass, setConfirmPass] = React.useState("");

    const [showPass, setShowPass] = React.useState(false);

    const [errorMessages, setErrorMessages] = React.useState([false, false, false]);

    const [showModal, setShowModal] = React.useState(false);
    const [modalError, setModalError] = React.useState("");
    
    const [showLoading, setShowLoading] = React.useState(false);

    const loadingRef = React.useRef(null);

    function confirmInfo() {
        let vEmail = false;
        let vPassword = false;
        if (!userEmail.includes("@") && userEmail !== "") {
            vEmail = true;
        }
        if (password != confirmPass) {
            vPassword = true;
        }
        setErrorMessages([vEmail, false, vPassword]);
        return vEmail || vPassword;
    }

    React.useEffect(() => {
        if (showLoading && loadingRef.current) {
            loadingRef.current.classList.remove('overlay-fade-out');
            loadingRef.current.classList.add('overlay-fade-in');
        }
    }, [showLoading]);

    function updateShowLoading(state) {
        if (state) {
            setShowLoading(true);
        } else {
            if (loadingRef.current) {
                loadingRef.current.classList.remove('overlay-fade-in');
                loadingRef.current.classList.add('overlay-fade-out');
            }
            setTimeout(() => setShowLoading(false), 400);
        }
    }


    async function createUser() {
        if (confirmInfo()) {
            return;
        }
        
        updateShowLoading(true);

        const minLoadTime = new Promise(resolve => setTimeout(resolve, 700));

        try {
            const response = await fetch('/api/auth/user/create', {
                method: "POST",
                body: JSON.stringify({email: userEmail, username: username, password: password}),
                headers: {'Content-type': 'application/json'},
            });

            await minLoadTime;

            if(response?.status === 409) {
                setErrorMessages([false, true, false]);
                updateShowLoading(false);
            } else if (!response.ok) {
                const errorData = await response.json();
                setModalError(errorData.error);
                updateShowLoading(false);
                setShowModal(true);
            } else {
                const data = await response.json();
                onAuthChange(data, AuthState.Authenticated);
                // maybe change where it navigates to?
                updateShowLoading(false);
                setTimeout(() => navigate('/home'), 300);
            }

        } catch (err) {
            setModalError(err.toString());
            updateShowLoading(false);
            setShowModal(true);
        }
        
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
            {showLoading &&  (
                <div ref={loadingRef} className="loading-overlay-full">
                    <div className="spinner-blue"></div>
                </div>
            )}
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
                    <input className="create-input" type={showPass ? "text" : "password"} disabled={showLoading} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm password" 
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                createUser();
                            }
                        }} />
                    {errorMessages[2] && (<div className="create-error-message">Password does not match</div>)}
                </div>
                <div className="create-show-password-box">
                    <input type="checkbox" id="show-pass-create" checked={showPass} onChange={() => setShowPass(!showPass)} />
                    <span className="show-pass-create-header">Show password</span>
                </div>
                <button type="submit" className='create-acct-btn2' disabled={!userEmail || !username || !password || !confirmPass} onClick={() => createUser()}>Create Account</button>
            </div>
            <div className="create-logo-display">
                <img className="logo-image" src="/images/dice-footer-image1.png" />
                <div className="logo-title">
                    criticalfail
                </div>
            </div>

            <ErrorModal isOpen={showModal} onClose={() => setShowModal(false)}>
                {modalError}
            </ErrorModal>
        </main>
    );
}