import React from 'react';
import './profileInfo.css';

export function ProfileInfo({username}) {
    return (
        <div className="profile-wrapper">
            <img className="profile-image" src="/images/default-profile.png" />
            {username}
            &#94;
        </div>
    );
}