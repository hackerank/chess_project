import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';

import './Login.css'

export default function Login() {
    const { playerName, setPlayerName } = useState('');
    const { password, setPassword } = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const [goToSignUp, setgoToSignUp] = useState(false);

    if (goToSignUp === true) {
        return <Navigate to="/signup" />;
    }
    return (
        <>
            <div className='auth-form-container'>
                <form className='login_form' onSubmit={handleSubmit} >
                    <label htmlFor="playerName"> <b>Player Name</b> </label>
                    <input value={playerName} type="text" placeholder='' id='playerName' name='playerName' />
                    <label htmlFor="password"><b>Password</b></label>
                    <input value={password} type="password" placeholder='' id='password' name='password' />
                    <button type="submit" ><b>Log In</b></button>
                </form>
                <button className='link-btn' onClick={() => { setgoToSignUp(true); }} >Don't have an account? Register Here.</button>
            </div>
        </>
    )
}
