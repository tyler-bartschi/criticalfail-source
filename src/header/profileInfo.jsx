import React from 'react';
import './profileInfo.css';

export function ProfileInfo({username}) {
    function rotateCaret() {
        document.getElementById('rotating-caret').classList.toggle('rotate-caret');
    }

    return (
        <div className="profile-wrapper" onClick={() => rotateCaret()}>
            <img className="profile-image" src="/images/default-profile.png" />
            {username}
            {/* <span className="profile-indicator-arrow">&#94;</span>&#9662; */}
            <img className="caret" id="rotating-caret" src="/images/caret-background-removed.png" />
        </div>
    );
}