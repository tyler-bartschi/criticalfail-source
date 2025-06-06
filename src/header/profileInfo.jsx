import React from 'react';
import './profileInfo.css';
import {useNavigate} from 'react-router-dom';

export function ProfileInfo({user, globalLogout}) {
    const navigate = useNavigate();
    const [displayOptions, setDisplayOptions] = React.useState(false);
    const [firstLoad, setFirstLoad] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const dropdownControl = React.useRef(null);

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

    function onLogout() {
        // do some stuff
        // call global logout
        globalLogout();
    }

    return (
        <div>
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
        </div>
    );
}