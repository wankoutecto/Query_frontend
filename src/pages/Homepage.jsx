import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { isTokenValid } from './isTokenValid';


export default function Homepage() {
    const {token, username, logout} = useAuth();
    const [rotate, setRotate] = useState(0);
    const [queryList, setQueryList] = useState([]);
    const [index, setIndex] = useState(0);
    const [disableTransition, setDisableTransition] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const popupRef= useRef(null);
    const [refresh, setRefresh] = useState(0);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        const handlePopup = (e) => {
            if(popupRef.current && !popupRef.current.contains(e.target)){
                setIsActive(false);
            }
        }

        if(isActive){
                document.addEventListener("mousedown", handlePopup);
        }

        return () => {
            document.removeEventListener("mousedown", handlePopup);
        }
    },[isActive]);
    

    const onSwitchQuery = (direction) => {
        setDisableTransition(true);
        setRotate(0);
        if(direction === 'next'){
            //cycle forward
            setIndex((prev) => (prev + 1) % queryList.length || 0);
        }
        if(direction === 'back'){
            //cycle backward
            //(index - 1) + total of element) % total of element
            setIndex((prev) => ((prev - 1) + queryList.length) % queryList.length || 0); 
        }
        setTimeout(() => setDisableTransition(false), 0);
    };

    const handleRotate = () => {
        setRotate(rotate + 180);
    };

    useEffect(() => {
        const fetchQuery = async() => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/query/get/all`, 
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                if(res.status === 200){
                    setQueryList(res.data.data);
                    setIndex(prev => prev >= res.data.data.length? 0: prev);
                }
            } catch (error) {
                if(!isTokenValid(token)){
                    logout();
                }else if(err.status === 409){
                    console.log(error);
                }
            }
        };
        fetchQuery();
    }, [refresh]);
    
    const onMarkDone = async(queryId) => {
        try {
            const encodeQueryId = encodeURIComponent(queryId);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/query/done/${encodeQueryId}`,
                        {}, 
                        {headers: {Authorization: `Bearer ${token}`}});
            if(res.status  === 200){
                setRefresh((prev) => prev + 1);
                console.log("mark done");
            }
        } catch (error) {
           if(!isTokenValid(token)){
                logout();
            }else if(err.status === 409){
                console.log(error);
            }
        }
    };

    const onResetAll = async() => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/query/reset/all`,
                        {}, 
                        {headers: {Authorization: `Bearer ${token}`}});
            if(res.status  === 200){
                setRefresh((prev) => prev + 1);
                console.log("reset all");
            }
        } catch (error) {
            if(!isTokenValid(token)){
                logout();
            }else if(err.status === 409){
                console.log(error);
            }
        }finally{
            setIsActive(false);
        }
    };

    const onMarkHard = async(queryId) => {
        try {
            const encodeQueryId = encodeURIComponent(queryId);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/query/schedule/${encodeQueryId}`,
                        {}, 
                        {headers: {Authorization: `Bearer ${token}`}});
            if(res.status  === 200){
                setRefresh((prev) => prev + 1);
                console.log("Mark Hard");
            }
        } catch (error) {
            if(!isTokenValid(token)){
                logout();
            }else if(err.status === 409){
                console.log(error);
            }
        }
    };

    const onAddQuery = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/query/add`,
                        {question, answer}, 
                        {headers: {Authorization: `Bearer ${token}`}});
            if(res.status  === 200){
                setRefresh((prev) => prev + 1);
                console.log("query added");
                setAnswer('');
                setQuestion('');
            }
        } catch (error) {
            if(!isTokenValid(token)){
                logout();
            }else if(err.status === 409){
                console.log(error);
            }
        }
    };


  return (
    
        <div className='quiz-body'>
            <div className='quiz-container'>
                <div className='quiz-container-left'>
                    <div className='card-container' onClick={handleRotate}>
                        <div className={'card'}  
                            style={{transform:`rotateX(${rotate}deg)`,
                            transition: disableTransition ? 'none' : 'transform 0.8s ease'}}>
                            <div className='front'>
                                <h3>Question</h3>
                                <p>{queryList[index]?.question || "No Query..."}</p>
                            </div>
                            <div className='back'>
                                <h3>Answer</h3>
                                <p>{queryList[index]?.answer || "No Query..."}</p>
                            </div>

                        </div>
                    </div> 

                    <div className='align-bottom-button'>
                        <button
                            onClick={() => {
                            onSwitchQuery('back');
                        }}>Back</button>

                        <p>{index + 1 > queryList.length ? 0 : index + 1}/{queryList.length}</p>

                        <button onClick={() => {
                            onSwitchQuery('next');
                        }}>Next</button>
                    </div>
                </div>

                <div className='quiz-container-right'>
                    <div className='align-right-button'>
                        <button onClick={() => setIsActive(true)}>Reset All</button>
                        <button onClick={() => onMarkDone(queryList[index].id)}>Done</button>
                        <button onClick={() => onMarkHard(queryList[index].id)}>Hard</button>
                    </div>
                </div>

            
            </div>
            <div className='query-container'>
                <div className='quiz-logout'>
                    <button 
                    style={{background:"white", borderRadius:"20px"}}
                    >{username}</button>
                    <button onClick={logout}>Log out</button>
                </div>
                <div className='query-from'>
                    <form className='add-query-form' onSubmit={onAddQuery}>
                        <h2 className='title'>Add Query</h2>
                        <label>Question: </label>
                        <input
                            type='text'
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        ></input>
                        <label>Answer: </label>
                        <input
                            type='text'
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            required
                        ></input>
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            </div>
            
            {isActive && 
            <div className='popup-container'>
                <div className='popup-card' ref={popupRef}>
                    <button onClick={onResetAll}>Reset</button>
                    <button onClick={() => setIsActive(false)}>Cancel</button>
                </div>
            </div>
            }
        </div>
  );
}
