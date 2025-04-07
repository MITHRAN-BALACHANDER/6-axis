import React from 'react';

import Header from '../components/Header'
import Navbar from '../components/Navbar'
const Help = () => {
    return (
        <div >
            <Header/>
            <Navbar />
            <br/>
            <h1>Help !</h1>
            <p>If you need assistance, please refer to the following resources:</p>
            <ul>
                <li>
                    <a href="/faq" style={{ color: 'blue', textDecoration: 'underline' }}>
                        Frequently Asked Questions
                    </a>
                </li>
                <li>
                    <a href="/contact" style={{ color: 'blue', textDecoration: 'underline' }}>
                        Contact Support
                    </a>
                </li>
                <li>
                    <a href="/guides" style={{ color: 'blue', textDecoration: 'underline' }}>
                        User Guides
                    </a>
                </li>
            </ul>
            <p>
                For further help, feel free to reach out to our support team at{' '}
                <a href="admin@siet.ac.in" style={{ color: 'blue', textDecoration: 'underline' }}>
                   admin@siet.ac.in
                </a>.
            </p>
        </div>
    );
};

export default Help;