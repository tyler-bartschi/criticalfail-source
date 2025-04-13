import React from 'react';
import './profileInfo.css';
import { jsx } from 'react/jsx-runtime';

export function ProfileInfo({username}) {
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

    return (
        <div>
            <div ref={dropdownControl} className="profile-wrapper" onClick={() => rotateCaret()}>
                <img className="profile-image" src="/images/default-profile.png" />
                <span className="username-display">{username}</span>
                <img className="caret" id="rotating-caret" src="/images/caret-background-removed.png" />
            </div>
            <div ref={dropdownRef} id="profile-options-id" className={`profile-options-display ${firstLoad ? (displayOptions ? 'profile-options-fade-in' : 'profile-options-fade-away') : "no-show"}`}>
                <div className="profile-option">Profile Settings</div>
                <div className="profile-option">My Stuff</div>
                <div className="profile-option">Friends</div>
                <div className="profile-option p-o-logout">Logout</div>
            </div>
        </div>
    );
}