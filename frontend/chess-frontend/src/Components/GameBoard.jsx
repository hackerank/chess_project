import React, { useRef, useState, useEffect } from 'react'
import './GameBoard.css'
import Tile from './Tile';
import Referee from './Referee';
import { GRID_SIZE, horizontalAxis, verticalAxis } from '../constants';
import io from 'socket.io-client';

import IP_ADDRESS from '../ip_add';

export let piece = {
  image: String,
  x: Number,
  y: Number,
  type: String,
  team: String,
  enPassant: Boolean
}

// array which holds the information regarding initial chess pieces and their 
const initialBoardStateWhite = [];

const initialBoardStateBlack = [];



for (let p = 0; p < 2; p++) {
  const teamType = (p === 0) ? "opponent" : "our";
  const color =  ((p === 0) ? "B" : "W");
  const pawns_x_cor = (p === 0) ? 1 : 6;
  const main_piece_x_cor = (p === 0) ? 0 : 7;
  //pawns
  for (let i = 0; i < 8; ++i) {
    initialBoardStateWhite.push({ image: `assets/images/${color}_pawn.png`, x: pawns_x_cor, y: i, type: "pawn", team: teamType });
  }
  //rooks
  initialBoardStateWhite.push({ image: `assets/images/${color}_rook.png`, x: main_piece_x_cor, y: 0, type: "rook", team: teamType });
  initialBoardStateWhite.push({ image: `assets/images/${color}_rook.png`, x: main_piece_x_cor, y: 7, type: "rook", team: teamType });
  //knights
  initialBoardStateWhite.push({ image: `assets/images/${color}_knight.png`, x: main_piece_x_cor, y: 1, type: "knight", team: teamType });
  initialBoardStateWhite.push({ image: `assets/images/${color}_knight.png`, x: main_piece_x_cor, y: 6, type: "knight", team: teamType });
  //bishops
  initialBoardStateWhite.push({ image: `assets/images/${color}_bishop.png`, x: main_piece_x_cor, y: 2, type: "bishop", team: teamType });
  initialBoardStateWhite.push({ image: `assets/images/${color}_bishop.png`, x: main_piece_x_cor, y: 5, type: "bishop", team: teamType });
  //kings
  initialBoardStateWhite.push({ image: `assets/images/${color}_king.png`, x: main_piece_x_cor, y: 4, type: "king", team: teamType });
  //queens
  initialBoardStateWhite.push({ image: `assets/images/${color}_queen.png`, x: main_piece_x_cor, y: 3, type: "queen", team: teamType });
}

for (let p = 0; p < 2; p++) {
  const teamType = (p === 0) ? "opponent" : "our";
  const color =  ((p === 0) ? "W" : "B");
  const pawns_x_cor = (p === 0) ? 1 : 6;
  const main_piece_x_cor = (p === 0) ? 0 : 7;
  //pawns
  for (let i = 0; i < 8; ++i) {
    initialBoardStateBlack.push({ image: `assets/images/${color}_pawn.png`, x: pawns_x_cor, y: i, type: "pawn", team: teamType });
  }
  //rooks
  initialBoardStateBlack.push({ image: `assets/images/${color}_rook.png`, x: main_piece_x_cor, y: 0, type: "rook", team: teamType });
  initialBoardStateBlack.push({ image: `assets/images/${color}_rook.png`, x: main_piece_x_cor, y: 7, type: "rook", team: teamType });
  //knights
  initialBoardStateBlack.push({ image: `assets/images/${color}_knight.png`, x: main_piece_x_cor, y: 1, type: "knight", team: teamType });
  initialBoardStateBlack.push({ image: `assets/images/${color}_knight.png`, x: main_piece_x_cor, y: 6, type: "knight", team: teamType });
  //bishops
  initialBoardStateBlack.push({ image: `assets/images/${color}_bishop.png`, x: main_piece_x_cor, y: 2, type: "bishop", team: teamType });
  initialBoardStateBlack.push({ image: `assets/images/${color}_bishop.png`, x: main_piece_x_cor, y: 5, type: "bishop", team: teamType });
  //kings
  initialBoardStateBlack.push({ image: `assets/images/${color}_king.png`, x: main_piece_x_cor, y: 3, type: "king", team: teamType });
  //queens
  initialBoardStateBlack.push({ image: `assets/images/${color}_queen.png`, x: main_piece_x_cor, y: 4, type: "queen", team: teamType });
}

//the url where the web socket server is listening for connections
const SOCKET_URL = `ws://${IP_ADDRESS}:8085/`;

// global socket object to use for communication with the server
const socket = io(SOCKET_URL);


export default function GameBoard({room, isBlack }) {
  // this is a state variable that is used to determine the state of the game ,
  // we need to fetch this from the backend on component mount, but the fetching should be performed after 1 second  
  const [gameState, setGameState] = useState("not_started");

  // state variable to hold the number of clients joined at any given point of time
  const [numClients, setNumClients] = useState(0);

  const [gameOverDis,setGameOverDis] = useState(null);

  const [enPassantAttackers, setEnPassantAttackers] = useState(null);

  const [gameResult,setGameResult] = useState(null);

  // state variable to determine if the state is white or black
  const [isBlackState, setIsBlackState] = useState(false);


  const [activePiece, setActivePiece] = useState(null);
  // const [gridX, setGridX] = useState(0);
  // const [gridY, setGridY] = useState(0);
  // const [pieces, setPieces] = useState(isBlack ? initialBoardStateBlack : initialBoardStateWhite);
  const [pieces, setPieces] = useState(initialBoardStateWhite);
  const chessBoardRef = useRef(null);
  const pawnPromotionModalRef = useRef(null);
  const referee = new Referee();
  const [promotionPawn, setPromotionPawn] = useState(null);
  const gameStartButtonRef = useRef(null);
  const [turn, setTurn] = useState(null);
  const [dots, setDots] = useState([]);
  const [enPassantAttackCoordinates,setenPassantAttackCoordinates] = useState(null);
  const [castleRooks,setCastleRooks] = useState(null);


  // JOIN THE ROOM ON COMPONENT MOUNT + LEAVE THE ROOM ON Component Unmount
  useEffect(() => {
    let color = "white";
    if (sessionStorage.getItem(room) != null) {
      color = sessionStorage.getItem(room);
      color === "white" ? setIsBlackState(false) : setIsBlackState(true);
    }
    socket.emit('joinRoomEvent', JSON.stringify({ 'room': `${room}`, 'color': `${color}` }));
    return () => {
      socket.emit('leaveRoomEvent', room);
    }
  }, []);

  useEffect(() => {
    setInterval(() => {
      fetch(`http://${IP_ADDRESS}:8080/api/num_clients`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: room
      })
        .then(response => response.json())
        .then(data => {
          setNumClients(data["num_clients"]);
        })
        .catch(error => console.error('Error:', error));
    }, 1000);
  }, []);

  useEffect(() => {
    if (gameStartButtonRef) {
      if (numClients != 2 || gameState != 'not_started') {
        if (!gameStartButtonRef.current.classList.contains('two_clients'))
          gameStartButtonRef.current.classList.add('two_clients');
      }
      else {
        if (gameStartButtonRef.current.classList.contains('two_clients'))
          gameStartButtonRef.current.classList.remove('two_clients');
      }
    }
  }, [numClients, gameState]);

  useEffect(() => {
    if (gameState == "completed") {
      setGameOverDis("GAME IS OVER !!! PLEASE START NEW GAME !! ")
    }
  }, [gameState]);

  socket.on("pieceInfo", (data) => {
    const jsondata = JSON.parse(data);
    setPieces(jsondata["pieces"]);
    setGameState(jsondata["game_state"]);
    if(jsondata["turn"] != "NA")
    setTurn(jsondata["turn"])
  });

  socket.on("newMoveUpdateServerToClient", (data) => {
    const jsondata = JSON.parse(data);
    setPieces(jsondata["pieces"]);
    if(turn === "white")
    setTurn("black");
    else
    setTurn("white")
  });

  socket.on("gameEndEvent", (data) => {
    const jsondata = JSON.parse(data);
    const res = jsondata["result"];
    const resDis = (res === "white") ? "WHITE WON" : ((res === "black") ? "BLACK WON" : "STALEMATE");
    setGameResult(resDis);
    setGameState("completed");
    //result will be ("black" / "white" / "")  --- FE TBD
  });

  socket.on("colorMsg", (data) => {
    (data === "white") ? setIsBlackState(false) : setIsBlackState(true);
    (data === "white") ? setPieces(initialBoardStateWhite) : setPieces(initialBoardStateBlack);
    setGameState("started");
    setTurn("white");
    sessionStorage.setItem(room, data);
  });

  function startGameHandler() {
    socket.emit('startGameEvent', room);
  }

  socket.on('enPassant', (data) => {
    const jsondata = JSON.parse(data);
    const x = jsondata["x"];
    const y = jsondata["y"];
    const attackers = pieces.filter(p=> (p.x === y) && (p.type === "pawn") && (p.team === "our") && Math.abs(p.y-x) === 1);
    setEnPassantAttackers(attackers);
    setEnPassant(true);
    setenPassantAttackCoordinates({x:x,y:y});
  })

  const [pawnPromoteCoordinates,setPawnPromoteCoordinates] = useState(null);
  const [enPassant,setEnPassant] = useState(null);

  function handlePawnPromotion(activePiece,x,y,captureFlag)
  {
    setPromotionPawn(activePiece);
    setPawnPromoteCoordinates({x:y,y:x});
    pawnPromotionModalRef.current.classList.remove('hidden');
  }

  function normalMove(x, y) {
    const a = dots.find((d) => d.i === x && d.j === y);
    if (a) {
      if(activePiece && activePiece.type === "pawn" && (y=== 0))
      {
        handlePawnPromotion(activePiece,x,y,false);
      }
      else
      {
        if(activePiece.type === "pawn" && Math.abs(activePiece.x-y) === 2)
        {
          socket.emit("eligibleForEnPassant",JSON.stringify({room:room,x:x,y:y}));
        }
        const updatedPieces = [];
        pieces.forEach((p) => {
          if (p === activePiece) {
            if(p.type === "king")
            {
              socket.emit('kingMove',JSON.stringify({ 'room': `${room}`, 'color': `${(isBlackState == true)?"black":"white"}`}));
            }
            else if(p.type === "rook" && p.x === 7 && p.y === 7)
            {
              socket.emit('kingRookMove',JSON.stringify({ 'room': `${room}`, 'color': `${(isBlackState == true)?"black":"white"}`}));
            }
            else if(p.type === "rook" && p.x === 7 && p.y === 0)
            {
              socket.emit('queenRookMove',JSON.stringify({ 'room': `${room}`, 'color': `${(isBlackState == true)?"black":"white"}`}));
            }
            p.x = y;
            p.y = x;
            updatedPieces.push(p);
          }
          else {
            updatedPieces.push(p);
          }
        });
        setPieces(updatedPieces);
        setDots([]);
        socket.emit("newMoveToServer", JSON.stringify({ pieces: updatedPieces, room: room, color: isBlackState ? "black" : "white" }));
        if (referee.inCheck(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
          if (referee.inCheckMate(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
            socket.emit("checkmate", JSON.stringify({ room: room, color: isBlackState ? "black" : "white" }));
          }
        }
        else {
          if (referee.isStaleMate(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
            socket.emit("stalemate", JSON.stringify({ room: room, color: isBlackState ? "black" : "white" }));
          }
        }
        if(turn === "white")
        setTurn("black");
        else
        setTurn("white")
        setActivePiece(null);
        setEnPassant(null);
        setEnPassantAttackers(null);
        setenPassantAttackCoordinates(null);
        setCastleRooks(null);
      }
    }
  }

  function captureMove(a) {
    if(activePiece && activePiece.type === "pawn" && (a.j=== 0))
    {
      handlePawnPromotion(activePiece,a.i,a.j,true);
    }
    else
    {
      const updatedPieces = [];
      pieces.forEach((p) => {
        if (p === activePiece) {
          if(p.type === "king")
          {
            socket.emit('kingMove',JSON.stringify({ 'room': `${room}`, 'color': `${(isBlackState == true)?"black":"white"}`}));
          }
          else if(p.type === "rook" && p.x === 7 && p.y === 7)
          {
            socket.emit('kingRookMove',JSON.stringify({ 'room': `${room}`, 'color': `${(isBlackState == true)?"black":"white"}`}));
          }
          else if(p.type === "rook" && p.x === 7 && p.y === 0)
          {
            socket.emit('queenRookMove',JSON.stringify({ 'room': `${room}`, 'color': `${(isBlackState == true)?"black":"white"}`}));
          }
          if(enPassantAttackers)
          {
            enPassantAttackers.forEach((attacker)=>{
              if(attacker.x === p.x && attacker.y === p.y && enPassantAttackCoordinates.y === a.j && enPassantAttackCoordinates.x === a.i)
              {
                p.x = enPassantAttackCoordinates.y -1;
                p.y = enPassantAttackCoordinates.x;
              }
            })
          }
          else
          {
            p.x = a.j;
            p.y = a.i;
          }
          updatedPieces.push(p);
        }
        else {
          if (!(p.x === a.j && p.y === a.i)) {
            updatedPieces.push(p);
          }
        }
      });
      setPieces(updatedPieces);
      setDots([]);
      socket.emit("newMoveToServer", JSON.stringify({ pieces: updatedPieces, room: room, color: isBlackState ? "black" : "white" }));
      if (referee.inCheck(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
        if (referee.inCheckMate(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
          socket.emit("checkmate", JSON.stringify({ room: room, color: isBlackState ? "black" : "white" }));
        }
      }
      else {
        if (referee.isStaleMate(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
          socket.emit("stalemate", JSON.stringify({ room: room, color: isBlackState ? "black" : "white" }));
        }
      }
      if(turn === "white")
      setTurn("black");
      else
      setTurn("white")
      setActivePiece(null);
      setEnPassant(null);
      setEnPassantAttackers(null);
      setenPassantAttackCoordinates(null);
      setCastleRooks(null);
    }
  }


  function validMovesDisplay(x, y) {
    const currentPiece = pieces.find(p => p.y === x && p.x === y);
    const dotsArr = [];
    for (let i = 0; i <= 7; ++i) {
      for (let j = 0; j <= 7; j++) {
        const a = referee.isValidMove(y, x, j, i, currentPiece.type, currentPiece.team, pieces, true);
        if (a) {
          const newBoardState = referee.getBoardStateAfterMove(currentPiece.x, currentPiece.y, i, j, pieces);
          if (!referee.inCheck(newBoardState, currentPiece.team)) {
            dotsArr.push({ i: i, j: j });
          }
        }
      }
    }
    if (enPassantAttackers) {
      enPassantAttackers.forEach((p) => {
        if (p.x === currentPiece.x && p.y === currentPiece.y) {
          const newBoardState = referee.getBoardStateAfterMove(currentPiece.x, currentPiece.y,  enPassantAttackCoordinates.y, enPassantAttackCoordinates.x, pieces);
          if (!referee.inCheck(newBoardState, currentPiece.team)) {
            dotsArr.push({ i: enPassantAttackCoordinates.x, j: enPassantAttackCoordinates.y });
          }
        }
      })
    }
    if(!referee.inCheck(pieces,"our"))
    {
      if(currentPiece.type === "king")
      {
        const req = JSON.stringify({room:room,color:(isBlackState == true?"black":"white")});
        fetch(`http://${IP_ADDRESS}:8080/api/castling`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: req
        })
          .then(response => response.json())
          .then(data => {
            if(isBlackState == false)
            {
              console.log(data)
              console.log('got here')
                //white
                //king side 
                const kingSideSquares = [{x:5,y:7},{x:6,y:7}];
                const queenSideSquares = [{x:1,y:7},{x:2,y:7},{x:3,y:7}];
                let occupiedKingSide = false;
                let  occupiedQueenSide = false;
                kingSideSquares.forEach((square)=>{
                  if(referee.isTileOccupied(square.x,square.y,pieces))
                  {
                    occupiedKingSide = true;
                  }
                })
                console.log(occupiedKingSide)
                queenSideSquares.forEach((square)=>{
                  if(referee.isTileOccupied(square.x,square.y,pieces))
                  {
                    occupiedQueenSide = true;
                  }
                })
                const rooks = []
                if(!occupiedKingSide && !areSquaresAttacked(kingSideSquares) && data["king"] === false && data["kingRook"] === false)
                {
                  console.log('we are eligible to castle king side for white');
                  rooks.push(pieces.find(p => p.x === 7 && p.y === 7))
                }
                if(!occupiedQueenSide && !areSquaresAttacked(queenSideSquares) && data["king"] === false && data["queenRook"] === false)
                {
                  console.log('we are eligible to castle queen side for white');
                  rooks.push(pieces.find(p => p.x === 7 && p.y === 0))
                }
                setCastleRooks(rooks);
            }
            else
            {
     
                const kingSideSquares = [{x:1,y:7},{x:2,y:7}];
                const queenSideSquares = [{x:4,y:7},{x:5,y:7},{x:6,y:7}];
                let occupiedKingSide = false;
                let  occupiedQueenSide = false;
                kingSideSquares.forEach((square)=>{
                  if(referee.isTileOccupied(square.x,square.y,pieces))
                  {
                    occupiedKingSide = true;
                  }
                })
                queenSideSquares.forEach((square)=>{
                  if(referee.isTileOccupied(square.x,square.y,pieces))
                  {
                    occupiedQueenSide = true;
                  }
                })
                const rooks = []
                if(!occupiedKingSide && !areSquaresAttacked(kingSideSquares) && data["king"] === false && data["queenRook"] === false)
                {
                  console.log('we are eligible to castle king side for black');
                  rooks.push(pieces.find(p => p.x === 7 && p.y === 0))


                }
                if(!occupiedQueenSide && !areSquaresAttacked(queenSideSquares) && data["king"] === false && data["kingRook"] === false)
                {
                  console.log('we are eligible to castle queen side for black');
                  rooks.push(pieces.find(p => p.x === 7 && p.y === 7))
                }
                setCastleRooks(rooks);
            }
          })
          .catch(error => console.error('Error:', error));
      }
      else
      {
        setCastleRooks(null);
      }
    }
    setDots(dotsArr);
    setActivePiece(currentPiece);
  }

  function areSquaresAttacked(squares)
  {
    let ret = false;
    squares.forEach((square) => {
      pieces.forEach((piece) => {
        if (piece.team === "opponent") {
          if (referee.isValidMove(piece.x, piece.y, square.y , square.x, piece.type, piece.team, pieces, false)) {
            ret = true;
          }
        }
      })
    })
    return ret;
  }

  function grabPiece(e) {
    if (!(gameState == "completed")) {
      const chessboard = chessBoardRef.current;
      const element = (e.target);
      let x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      let y = Math.floor((e.clientY - chessboard.offsetTop) / GRID_SIZE);
      if (chessboard) {
        if (!element.classList.contains("chess-piece")) {
          normalMove(x, y)
        }
        else {
          if (gameState === "not_started") {
            console.log("Please let the game begin to make moves"); // we need to develop UI for this 
          }
          else {
            if ((turn === "black" && isBlackState === true) || (turn === "white" && isBlackState === false)) {
              const a = dots.find((d) => d.i === x && d.j === y);
              if (a) {
                captureMove(a)
              }
              else {
                if(castleRooks == null)
                validMovesDisplay(x, y);
                else
                {
                  let castleFlag = false;
                  console.log(`x=${x}`);
                  console.log(`y=${y}`);
                  castleRooks.forEach((castleRook)=>{
                    console.log(castleRook)
                    if(castleRook.x === y && castleRook.y === x)
                    {
                      castleFlag = true;
                      const updatedPieces=[];
                      if(isBlackState === false)
                      {
                        let kingS = false;
                        pieces.forEach((p)=>{
                          if(p.x === y && p.y === x)
                          {
                            if(p.y === 7)
                            {
                              p.y = 5;
                              kingS = true;
                            }
                            else if(p.y === 0)
                            {
                              p.y = 3;
                            }
                            updatedPieces.push(p);
                          }
                          else
                          {
                            if (!(p.x === 7 && p.y === 4)) {
                              updatedPieces.push(p);
                            }
                            else
                            {
                              (kingS === true) ? p.y = 6 : p.y = 2;
                              updatedPieces.push(p);
                            }
                          }
                        })
                      }
                      else
                      {
                        let kingS = false;
                        pieces.forEach((p)=>{
                          if(p.x === y && p.y === x)
                          {
                            console.log(p.y)
                            if(p.y === 7)
                            {
                              p.y = 4;
                              
                            }
                            else if(p.y === 0)
                            {
                              p.y = 2;
                              kingS = true;
                            }
                            updatedPieces.push(p);
                          }
                          else
                          {
                            if (!(p.x === 7 && p.y === 3)) {
                              updatedPieces.push(p);
                            }
                            else
                            {
                              (kingS === true) ? p.y = 1 : p.y = 5;
                              updatedPieces.push(p);
                            }
                          }
                        })
                      }
                      setPieces(updatedPieces);
                      setDots([]);
                      socket.emit('kingMove',JSON.stringify({ 'room': `${room}`, 'color': `${(isBlackState == true)?"black":"white"}`}));
                      socket.emit("newMoveToServer", JSON.stringify({ pieces: updatedPieces, room: room, color: isBlackState ? "black" : "white" }));
                      if (referee.inCheck(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
                        if (referee.inCheckMate(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
                          socket.emit("checkmate", JSON.stringify({ room: room, color: isBlackState ? "black" : "white" }));
                        }
                      }
                      else {
                        if (referee.isStaleMate(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
                          socket.emit("stalemate", JSON.stringify({ room: room, color: isBlackState ? "black" : "white" }));
                        }
                      }
                      if(turn === "white")
                      setTurn("black");
                      else
                      setTurn("white");
                      setActivePiece(null);
                      setEnPassant(null);
                      setEnPassantAttackers(null);
                      setenPassantAttackCoordinates(null);
                      setCastleRooks(null);
                    }
                  });
                  if(!castleFlag)
                  {
                    validMovesDisplay(x,y);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

   function  promotePawn(type) {
    if (promotionPawn) {
      const updatedPieces = [];
      pieces.forEach((piece) => {
        if (promotionPawn === piece) {
          piece.type = type;
          piece.image = (!isBlackState) ? ((piece.team === "our") ? `/assets/images/W_${type}.png` : `/assets/images/B_${type}.png`) : ((piece.team === "our") ? `/assets/images/B_${type}.png` : `/assets/images/W_${type}.png`);
          piece.x = pawnPromoteCoordinates.x;
          piece.y = pawnPromoteCoordinates.y;
          updatedPieces.push(piece);
        }
        else
        {
          if(!(piece.x === pawnPromoteCoordinates.x && piece.y === pawnPromoteCoordinates.y))
          updatedPieces.push(piece);
        }
      });
      setPieces(updatedPieces);
      setDots([]);
      socket.emit("newMoveToServer", JSON.stringify({ pieces: updatedPieces, room: room, color: isBlackState ? "black" : "white" }));
      if (referee.inCheck(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
        if (referee.inCheckMate(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
          socket.emit("checkmate", JSON.stringify({ room: room, color: isBlackState ? "black" : "white" }));
        }
      }
      else {
        if (referee.isStaleMate(updatedPieces, activePiece.team === "our" ? "opponent" : "our") === true) {
          socket.emit("stalemate", JSON.stringify({ room: room, color: isBlackState ? "black" : "white" }));
        }
      }
      if(turn === "white")
      setTurn("black");
      else
      setTurn("white");
      setActivePiece(null);
      setPawnPromoteCoordinates(null);
      setPromotionPawn(null);
      setEnPassant(null);
      setEnPassantAttackers(null);
      setenPassantAttackCoordinates(null);
      setCastleRooks(null);
      pawnPromotionModalRef.current.classList.add('hidden');
    }
  }

  function promotionTeamType() {
    if (promotionPawn)
      return (!isBlackState) ? (promotionPawn.team === "our" ? "W" : "B") : (promotionPawn.team === "our" ? "B" : "W");
  }


  let board = [];
  for (let i = 0; i < verticalAxis.length; ++i) {
    for (let j = 0; j < horizontalAxis.length; ++j) {
      let image = undefined;
      pieces.forEach(p => { if (p.x === i && p.y === j) image = p.image });
      const dotsfound = dots.find((d) => d.i === j && d.j === i)
      board.push(<Tile key={`${j},${i}`} isDotted={dotsfound ? true : false} num={i * i + j} image={image} />);
    }
  }
  return (
    <>
      <div id="pawn-promotion-modal" className='hidden' ref={pawnPromotionModalRef}>
        <div className='modal-body' >
          <img onClick={ () => promotePawn("rook")} src={`/assets/images/${promotionTeamType()}_rook.png`} />
          <img onClick={ () => promotePawn("queen")} src={`/assets/images/${promotionTeamType()}_queen.png`} />
          <img onClick={ () => promotePawn("knight")} src={`/assets/images/${promotionTeamType()}_knight.png`} />
          <img onClick={ () => promotePawn("bishop")} src={`/assets/images/${promotionTeamType()}_bishop.png`} />
        </div>
      </div>
      <div /*onMouseMove={e =>  movePiece(e)}*/ onPointerDown={e => grabPiece(e)} /*onMouseUp={e => dropPiece(e)}*/ id="gameboard" ref={chessBoardRef}>
        {board}
      </div>
      <div> <b>Number of Clients  = {numClients}</b></div>
      <div>
        <button ref={gameStartButtonRef} onClick={startGameHandler}>Start Game</button>
      </div>
      <div className='turnDis' >
        {turn}'s  Turn
      </div>
      <div>
        <b> Result = {gameResult}</b>
      </div>
      <div>
        <b> {gameOverDis}</b>
      </div>
    </>
  );
}
