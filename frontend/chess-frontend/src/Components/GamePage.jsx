import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import GameBoard from './GameBoard';
import './GamePage.css'

import IP_ADDRESS from '../ip_add';

export default function GamePage() {
    const CREATE_GAME_API_URL = `http://${IP_ADDRESS}:8080/api/create_game`;
    const ROOM_API_URL = `http://${IP_ADDRESS}:8080/api/is_room_present`;
    const [roomId, setRoomId] = useState('');
    const [color,setColor] = useState(null);
    const [gamecontent, setGameContent] = useState(null);
    const [startGameRoomId, setStartGameRoomId] = useState(null);
    const [navigateToRoom, setNavigateToRoom] = useState(null);
    const [invalidRoomID, setinvalidRoomID] = useState(null);
    const [errorMsg,setErrorMsg] = useState(null);
    function startGameHandler() {
        fetch(CREATE_GAME_API_URL, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: "white"
        })
            .then(response => response.json())
            .then(data => {
                setStartGameRoomId(data["room_id"]);
                setGameContent(1);
            })
            .catch(error => console.error('Error:', error));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const color = 'W';
        setColor(color);
        fetch(ROOM_API_URL, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: roomId
        })
            .then(response => response.json())
            .then(data => {
                if (data["is_room_present"] === "true") {
                    //here we go into nested fetch if the room is present
                    fetch(`http://${IP_ADDRESS}:8080/api/num_clients`, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: roomId
                    })
                        .then(response => response.json())
                        .then(data => {
                            if ((data["num_clients"] < 2)) {
                                setinvalidRoomID(true);
                                setNavigateToRoom(true);
                                setErrorMsg(null);
                            }
                            else {
                                
                                setErrorMsg("Two Players are Aready Connected !! You cannot join this room !!!");
                            }
                        })
                        .catch(error => console.error('Error:', error));
                    
                }
                else {
                    setinvalidRoomID(false);
                }
            })
            .catch(error => console.error('Error:', error));
    };

    if (navigateToRoom && navigateToRoom === true) {
        return <Navigate to={"/room"} state={{ roomId, color }} />;
    }
    return (
        <div>
            {!gamecontent && <button onClick={startGameHandler}> <b>Start New Game</b> </button>}
            {
                gamecontent &&
                <div>
                    <div className='roomMsg'>
                        Use below room ID to join your game !!! Also send this room ID to your opponent to join.
                    </div>
                    <br />
                    <div className='roomIdDisplay'>{startGameRoomId}</div>
                </div>
            }
            <form action="submit" onSubmit={handleSubmit} >
                <label htmlFor="roomId"> <b> <h1>Enter Room ID</h1> </b> </label>
                <input value={roomId} onChange={(e) => { setRoomId(e.target.value) }} type="text" placeholder='' id='roomId' name='roomId' />
                <button type="submit" method="post"><b>Go To Room</b></button>
            </form>
            <>
                {
                    (invalidRoomID === false) ? <div>Invalid Room ID !!!! Please retry with another room ID</div> : <div></div>
                }
            </>
            <div>
                {
                    errorMsg
                }
            </div>
        </div>
    )
}
