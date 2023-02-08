import React from 'react';
import './Tile.css';
import Pieces from './Pieces';
export default function Tile({ isDotted, num, image }) {
    const className = ["tile",
        num % 2 === 0 && "white-tile", num % 2 !== 0 && "black-tile", isDotted && "dotted-tile"
    ].filter(Boolean).join(' ');
    return (<div className={className}> {image != null && <Pieces image={image} />} </div>)
}
