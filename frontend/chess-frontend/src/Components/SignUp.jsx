import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import './SignUp.css';

export default function SignUp() {
    const [playerName, setPlayerName] = useState('');
    const [password, setPassword] = useState('');
    const SIGN_UP_API_URL = "http://localhost:8080/api/register_player";
    const reqBody = {
        playerName: playerName,
        password: password
    }
    let signUp = async () => {
        let options = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(reqBody)
        };
        console.log(typeof options.body);
        let signUpPromise = await fetch(SIGN_UP_API_URL, options);
        let res = await signUpPromise.json();
        return res;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let signUpResult = await signUp();
        console.log(signUpResult);
    };
    const [goToLogin, setgoToLogin] = useState(false);

    if (goToLogin === true) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <div className="auth-form-container">
                <form className='signup_form' onSubmit={handleSubmit} >
                    <label htmlFor="playerName"> <b>Player Name</b> </label>
                    <input value={playerName} onChange={(e) => { setPlayerName(e.target.value) }} type="text" placeholder='' id='playerName' name='playerName' />
                    <label htmlFor="password"><b>Password</b> </label>
                    <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder='' id='password' name='password' />
                    <button type="submit" method="post"><b>Sign Up</b></button>
                </form>
                <button className='link-btn' onClick={() => { setgoToLogin(true); }} >Already have an account? Login Here.</button>
            </div>
        </>
    )
}


