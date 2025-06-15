import React from 'react';
import './about.css';
import {useNavigate} from 'react-router-dom';

export function AboutBack() {
    const navigate = useNavigate();
    return (
        <div className="about-back-wrapper" onClick={() => navigate('/login')}>Back</div>
    );
}