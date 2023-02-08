import React from 'react';
import './Tile.css';
export default function Pieces({ image }) {
    return (
        <div style={{ backgroundImage: `url(${image})` }} className="chess-piece"></div>
    )
}
