
export default class Referee {

    /**
     * 
     * @param {*} boardState given boardState at which we want to calculate checkmate
     * @param {*} team the team whose turn it is
     * @returns 
     */
    isStaleMate(boardState, team) {
        let ret = true;
        let count = 0;
        for (let i = 0; i < boardState.length; ++i) {
            const piece = boardState[i];
            if (piece.team === team) {
                for (let i = 0; i <= 7; ++i) {
                    for (let j = 0; j <= 7; j++) {
                        const a = this.isValidMove(piece.x, piece.y, j, i, piece.type, piece.team, boardState,false);
                        if (a) {
                            const newBoardState = this.getBoardStateAfterMove(piece.x, piece.y, i, j, boardState);
                            if (!this.inCheck(newBoardState, piece.team)) {
                              count++;
                            //   console.log(piece);
                            }
                        }
                        if (count > 0) {
                            ret = false;
                            break;
                        }
                    }
                    if (count > 0) {
                        ret = false;
                        break;
                    }
                }
            }
            if (count > 0) {
                ret = false;
                break;
            }
        }
        // console.log(`count = ${count}`);
        return ret;
    }

    /**
     * given boardState and team we will calculate whether the given "team" is in checkmate or not
        basically we want to calculate if the given "team" has any valid moves or not 
        if any one valid move is found (move can be anywhere on the board) then return false
        else return true
     * 
     * 
     * @param {*} boardState given boardState at which we want to calculate checkmate
     * @param {*} team the team who is being checkmated
     * @returns  true if checkmate , false otherwise
     */
    inCheckMate(boardState, team) {
        let ret = true;
        let count = 0;
        for (let i = 0; i < boardState.length; ++i) {
            const piece = boardState[i];
            if (piece.team === team) {
                for (let i = 0; i <= 7; ++i) {
                    for (let j = 0; j <= 7; j++) {
                        const a = this.isValidMove(piece.x, piece.y, j, i, piece.type, piece.team, boardState,false);
                        if (a) {
                            const newBoardState = this.getBoardStateAfterMove(piece.x, piece.y, i, j, boardState);
                            if (!this.inCheck(newBoardState, piece.team)) {
                              count++;
                            //   console.log(piece);
                            }
                        }
                        if (count > 0) {
                            ret = false;
                            break;
                        }
                    }
                    if (count > 0) {
                        ret = false;
                        break;
                    }
                }
            }
            if (count > 0) {
                ret = false;
                break;
            }
        }
        // console.log(`count = ${count}`);
        return ret;
    }
    

    /**
     * 
     * @param {*} boardState state of board at which we want to check for "CHECK"
     * @param {*} team the team whose king is in check is to be checked
     * @returns 
     */
    inCheck(boardState, team) {
        const oppteam = (team === "our") ? "opponent" : "our";
        const king = boardState.find((p) => (p.team === team && p.type === "king"));
        if (!king) {
            return false;
        }
        let ret = false;
        for (let i = 0; i < boardState.length; ++i) {
            const piece = boardState[i];
            if (piece.team === oppteam) {
                if (this.isValidMove(piece.x, piece.y, king.x, king.y, piece.type, piece.team, boardState,false)) {
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    }


    // if (referee.inCheck(referee.getBoardStateAfterMove(x, y, i, j, pieces), currentPiece.team, room, "white")) {
    //     continue;
    //   }
    //   else{

    /**
     * 
     * @param {*} px  previous pos x
     * @param {*} py previous pos y
     * @param {*} fx final pos x
     * @param {*} fy final pos y
     * @param {*} boardState 
     * @returns  board state after move is made
     */
    getBoardStateAfterMove(px,py,fy,fx,boardState)
    {
        const ret = [];
        // if there is a piece on (fx,fy) we need to delete it
        boardState.forEach((ele) => {
            if (ele.x === fx && ele.y === fy) {
                // do nothing
            }
            else if (ele.x === px && ele.y === py) {
                const newEle = {...ele};
                newEle.y = fy; newEle.x = fx; ret.push(newEle);
            }
            else {
                const newEle = {...ele};
                ret.push(newEle);
            }
        })
        return ret;
    }

    isTileOccupied(x, y, boardState) {
        const piece = boardState.find((p) => (p.y === x && p.x === y));
        if (piece) {
            return true;
        }
        return false;
    }

    isTileOccupiedByOpponent(x, y, boardState, team) {
        const piece = boardState.find((p) => (p.y === x && p.x === y && p.team !== team));
        if (piece) {
            return true;
        }
        return false;
    }

    isEnPassantMove(py, px, y, x, type, team, boardState) {
        if ("pawn" === type) {
            const pawnDirection = "our" === team ? 1 : -1;
            if (x - px === 1 || x - px === -1) {
                if (py - y === 1 || py - y === -1) {
                    const enPassantAttackedPiece = boardState.find(p => ((p.y === x) && (p.x === y + pawnDirection) && p.enPassant));
                    if (enPassantAttackedPiece) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // py = initial y coordinate of the moving piece
    // px = initial x coordinate of the moving piece
    // y = y-coordinate of the place where we are moving the piece
    // x = x-coordinate of the place where we are moving the piece
    isValidMove(py, px, y, x, type, team, boardState,oppFlag) {
        if(oppFlag === true)
        {
            if(team === "opponent")
            return false;
        }

        if (px === x && py === y)
            return false;

        if (type === "pawn") {
            const pawnRow = (("our" === team) ? 6 : 1);
            const pawnDirection = (("our" === team) ? 1 : -1);
            //MOVEMENT LOGIC 
            if (py === pawnRow) {
                if (px === x && ((py - y) === 1 * pawnDirection || (py - y) === 2 * pawnDirection)) {
                    let retVal = false;
                    retVal = (py - y) === 1 * pawnDirection ? (!this.isTileOccupied(x, y, boardState)) : ((!this.isTileOccupied(x, y, boardState)) && (!this.isTileOccupied(x, y + pawnDirection, boardState)));
                    return retVal;
                }
                else if (x - px === 1 || x - px === -1) {
                    if ((py - y )=== 1 * pawnDirection) {
                        if (this.isTileOccupiedByOpponent(x, y, boardState, team))
                            return true;
                    }
                }

            }
            else if (x === px && ((py - y) === 1 * pawnDirection)) {
                return !this.isTileOccupied(x, y, boardState);
            }
            //ATTACKING LOGIC
            else if (x - px === 1 || x - px === -1) {
                if (/*py - y === 1 || py - y === -1*/ (py - y )=== 1 * pawnDirection) {
                    if (this.isTileOccupiedByOpponent(x, y, boardState, team))
                        return true;
                }
            }
        }
        else if (type === "knight") {
            const knight_prospects = [[px + 1, py - 2], [px + 1, py + 2], [px + 2, py - 1], [px + 2, py + 1], [px - 1, py - 2], [px - 1, py + 2], [px - 2, py - 1], [px - 2, py + 1]];
            let flag = false;
            for (let i = 0; i <= 7; ++i) {
                const curr = knight_prospects[i];
                if ((x === curr[0] && y === curr[1])) {
                    flag = true;
                    break;
                }
            }
            if (flag === false) {
                return flag;
            }
            else {
                if (this.isTileOccupied(x, y, boardState)) {
                    if (this.isTileOccupiedByOpponent(x, y, boardState, team)) {
                        return true;
                    }
                    else
                        return false;
                }
                else {
                    return true;
                }
            }
        }
        else if ("bishop" === type) {
            //move and attack logic for the bishop
            //check if the desired position is on a diagonal of the initial position.
           
            const isTheMoveOnDiag = (Math.abs(px - x) === Math.abs(py - y));
            if (!isTheMoveOnDiag)
                return false;
            else {
                const diagDir = [((x - px) > 0 ? 1 : -1), ((y - py) > 0 ? 1 : -1)];
                let curr = [px + diagDir[0], py + diagDir[1]];
                // pieces present in between.
                // c is the number of squares in between.
                let c = Math.abs(x - px) - 1;
                //here we are checking whether the in-between pieces are  blockading or not 
                //if they are bloakading then we deem the move invalid
                while (c--) {
                    if (this.isTileOccupied(curr[0], curr[1], boardState)) {
                        return false;
                    }
                    curr[0] += diagDir[0];
                    curr[1] += diagDir[1];
                }
                if (this.isTileOccupied(x, y, boardState) && !this.isTileOccupiedByOpponent(x, y, boardState, team)) {
                    return false;
                }
                return true;
            }

        }
        else if ("rook" === type) {
            //move and attack logic for the rook
            // check if the desired position is on a horizontal or vertical file of the original position  
            const isTheMoveOnSameFile = (px === x || py === y);
            if (!isTheMoveOnSameFile)
                return false;
            else {
                let curr = [(x === px ? x : ((x > px) ? px + 1 : px - 1)), (y === py ? y : ((y > py ? py + 1 : py - 1)))];
                // pieces present in between.
                // c is the number of squares in between.
                let c = Math.max(Math.abs(x - px), Math.abs(y - py)) - 1;
                //here we are checking whether the in-between pieces are  blockading or not 
                //if they are bloakading then we deem the move invalid
                while (c--) {
                    if (this.isTileOccupied(curr[0], curr[1], boardState)) {
                        return false;
                    }
                    let a = curr[0], b = curr[1];
                    curr[0] = (x === px ? a : ((x > px) ? a + 1 : a - 1));
                    curr[1] = (y === py ? b : ((y > py) ? b + 1 : b - 1));
                }
                if (this.isTileOccupied(x, y, boardState) && !this.isTileOccupiedByOpponent(x, y, boardState, team)) {
                    return false;
                }
                return true;
            }
        }
        else if ("queen" === type) {
            //move and attack logic for the queen
            // check if the desired position is on a horizontal or vertical file or on one of the diagonals of the original position  
            const isTheMoveOnSameFile = ((px === x || py === y));
            const isTheMoveOnDiag = (Math.abs(px - x) === Math.abs(py - y));
            if (!(isTheMoveOnSameFile || isTheMoveOnDiag))
                return false;
            else {
                if (isTheMoveOnDiag) {
                    const diagDir = [((x - px) > 0 ? 1 : -1), ((y - py) > 0 ? 1 : -1)];
                    let curr = [px + diagDir[0], py + diagDir[1]];
                    // pieces present in between.
                    // c is the number of squares in between.
                    let c = Math.abs(x - px) - 1;
                    //here we are checking whether the in-between pieces are  blockading or not 
                    //if they are bloakading then we deem the move invalid
                    while (c--) {
                        if (this.isTileOccupied(curr[0], curr[1], boardState)) {
                            return false;
                        }
                        curr[0] += diagDir[0];
                        curr[1] += diagDir[1];
                    }
                    if (this.isTileOccupied(x, y, boardState) && !this.isTileOccupiedByOpponent(x, y, boardState, team)) {
                        return false;
                    }
                    return true;
                }
                else {
                    let curr = [(x === px ? x : ((x > px) ? px + 1 : px - 1)), (y === py ? y : ((y > py ? py + 1 : py - 1)))];
                    // pieces present in between.
                    // c is the number of squares in between.
                    let c = Math.max(Math.abs(x - px), Math.abs(y - py)) - 1;
                    //here we are checking whether the in-between pieces are  blockading or not 
                    //if they are bloakading then we deem the move invalid
                    while (c--) {
                        if (this.isTileOccupied(curr[0], curr[1], boardState)) {
                            return false;
                        }
                        let a = curr[0], b = curr[1];
                        curr[0] = (x === px ? a : ((x > px) ? a + 1 : a - 1));
                        curr[1] = (y === py ? b : ((y > py) ? b + 1 : b - 1));
                    }
                    if (this.isTileOccupied(x, y, boardState) && !this.isTileOccupiedByOpponent(x, y, boardState, team)) {
                        return false;
                    }
                    return true;
                }
            }
        }
        else if ("king" === type) {
            const king_dir = [[px + 1, py], [px, py + 1], [px - 1, py], [px, py - 1], [px + 1, py + 1], [px + 1, py - 1], [px - 1, py - 1], [px - 1, py + 1]];
            const piece = king_dir.find((p) => (p[0] === x && p[1] === y));
            if (piece) {

            }
            else
                return false;

            if (this.isTileOccupied(x, y, boardState) && !this.isTileOccupiedByOpponent(x, y, boardState, team)) {
                return false;
            }
            return true;

        }
        return false;
    }
}



