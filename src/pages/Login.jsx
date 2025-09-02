import { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {onLogin} = useAuth();

    const logUser = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {username, password});
            if(res.status === 200){
                onLogin(res.data.data, username);
                console.log("successfully login");
            }
        } catch (error) {
           console.error(error);
        }
    }


    return (
    <div>
        <div className="form-container">
            <form className='form-card' onSubmit={logUser}>
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
                {error && <p>{error}</p>}
                <div style={{display: "flex", justifyContent: "center"}}>
                    <button>Log in</button>
                </div>
                <p>Dont have an account? <Link to={"/register"}>Sign in</Link></p>
            </form>
        </div>
    </div>);
}