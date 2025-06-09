import React from 'react';
import './footer.css';

import {AuthState} from "../login/AuthState";

export function Footer({authType}) {
    if (authType === AuthState.Authenticated || authType === AuthState.Admin) { 
        return (
            <footer>
                <img className="footer-image" src="images/dice-footer-image1.png" />
                {/* <img className="footer-image" src="images/dice-footer-image2.png" /> */}
                {/* <div className="footer-text">Creator: Tyler</div> */}
                <a href="https://github.com/tyler-bartschi/criticalfail-source" target="_blank" rel="noopener noreferrer" className='footer-link'>
                    GitHub Repository
                </a>
            </footer>
        );
    }
}