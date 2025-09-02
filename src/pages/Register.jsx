import { Link } from 'react-router-dom';
import '../App.css'
import { useState } from 'react';
import axios from 'axios';
export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [error, setError] = useState('');

    const onRegister = async(e) => {
        e.preventDefault();
        try {
            if(password !== conPassword){
                setError("Sorry! password and confirm password must be the same");
                return;
            }
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {username, password});
            if(res.status === 200){
                console.log("successfully registered");
            }
        } catch (error) {
            setError(error);
        }


    }

    return (
    <div>
        <div className="form-container">
            <form className='form-card' onSubmit={onRegister}>
                <div className='align'>
                    <label>Username</label>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        required
                    ></input>
                </div>
                <div className='align'>
                   <label>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        required
                    ></input> 
                </div>
                <div className='align'>
                    <label>Confirm Password</label>
                    <input
                        type='password'
                        value={conPassword}
                        onChange={(e) => {
                            setConPassword(e.target.value);
                            setError('');
                        }}
                        required
                    ></input>
                </div>
                {error && <p>{error}</p>}
                <div style={{display: "flex", justifyContent: "center"}}>
                    <button type='submit'>Sign up</button>
                </div>
                <p>already have an account? <Link to={"/login"}>Log in</Link></p>
            </form>
        </div>
    </div>);
}