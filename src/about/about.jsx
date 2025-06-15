import React from 'react';
import './about.css';

import {AuthState} from '../login/AuthState';
import {AboutBack} from './aboutBack';

export function About({authType}) {
    return (
        <div className="body">
            {authType === AuthState.Unauthenticated && (
                <header>
                    <div className="site-title">criticalfail</div>
                    <AboutBack />
                </header>
            )}
            <main>
                <div>About page placeholder</div>
            </main>
                {authType === AuthState.Unauthenticated && (
                    <footer>
                        <img className="footer-image" src="images/dice-footer-image1.png" />
                        <a href="https://github.com/tyler-bartschi/criticalfail-source" target="_blank" rel="noopener noreferrer" className='footer-link'>
                            GitHub Repository
                        </a>
                    </footer>
                )}
        </div>
        
    );
}