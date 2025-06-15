import React from 'react';
import './profileInfo.css';
import {useNavigate} from 'react-router-dom';
import {ErrorModal} from '../modals/errorModal';

export function ProfileInfo({user, globalLogout}) {
    const navigate = useNavigate();
    const [displayOptions, setDisplayOptions] = React.useState(false);
    const [firstLoad, setFirstLoad] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const dropdownControl = React.useRef(null);
    const [showModal, setShowModal] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showLoading, setShowLoading] = React.useState(false);

    const loadingRef = React.useRef(null);

    function rotateCaret() {
        document.getElementById('rotating-caret').classList.toggle('rotate-caret');
        setDisplayOptions((prevValue) => !prevValue);
        if (!firstLoad) {
            setFirstLoad((prevValue) => !prevValue);
        }
    }

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target) && dropdownControl.current && !dropdownControl.current.contains(e.target)) {
            rotateCaret();
        }
    }

    React.useEffect(() => {
        if (displayOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [displayOptions]);

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

    async function onLogout() {
        setShowLoading(true);

        const minLoadTime = new Promise(resolve => setTimeout(resolve, 700));

        try {
            const response = await fetch("/api/auth/user/logout", {
                method: "DELETE"
            });

            await minLoadTime;

            if(!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.error);
                updateShowLoading(false);
                setShowModal(true);
            } else {
                updateShowLoading(false);
                setTimeout(() => globalLogout(), 300);
            }
        } catch (err) {
            setErrorMessage(err.toString());
            updateShowLoading(false);
            setShowModal(true);
        }        
    }

    return (
        <div>
            {showLoading && (
                <div ref={loadingRef} className='loading-overlay-full'> 
                    <div className='spinner-blue'></div>
                </div>
            )}
            <div ref={dropdownControl} className="profile-wrapper" onClick={() => rotateCaret()}>
                <img className="profile-image" src={user.profile_url} />
                <span className="username-display">{user.username}</span>
                <img className="caret" id="rotating-caret" src="/images/caret-background-removed.png" />
            </div>
            <div ref={dropdownRef} id="profile-options-id" className={`profile-options-display ${firstLoad ? (displayOptions ? 'profile-options-fade-in' : 'profile-options-fade-away') : "no-show"}`}>
                <div className="profile-option" onClick={() => {navigate('/profile'); rotateCaret();}}>Profile Settings</div>
                <div className="profile-option" onClick={() => {navigate('/myStuff'); rotateCaret();}}>My Stuff</div>
                <div className="profile-option" onClick={() => {navigate('/friends'); rotateCaret();}}>Friends</div>
                <div className="profile-option p-o-logout" onClick={() => onLogout()} >Logout</div>
            </div>
            <ErrorModal isOpen={showModal} onClose={() => setShowModal(false)}>
                {errorMessage}
            </ErrorModal>
        </div>
    );
}