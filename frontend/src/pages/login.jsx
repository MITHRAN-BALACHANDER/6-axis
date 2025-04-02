import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './login.css';   
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'admin@siet.ac.in' && password === 'admin') {
            console.log('Login successful');
           // document.body.style.pointerEvents = "all";
           // window.location.href = '/home'; 
            navigate('/dashboard');
           
        } else {
            console.log('Invalid email or password');
            document.body.style.pointerEvents = "none";

        }
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className='login'>
        <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} >
                <div className="user-box">
                    <label>Email:</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="user-box">
                    <label>Password:</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='button'>Login</button>
            </form>
        </div>
        </div>
    );
};

export default Login;