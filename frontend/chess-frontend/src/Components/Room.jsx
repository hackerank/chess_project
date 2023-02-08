import React from 'react';
import GameBoard from './GameBoard';
import { useLocation } from 'react-router-dom';

export default function Room() {
  const data = useLocation();
  return (
    <>
      <GameBoard key={data.state.roomId} room={data.state.roomId} isBlack={data.state.color === 'B'?true:false} />
    </>
  );
}

