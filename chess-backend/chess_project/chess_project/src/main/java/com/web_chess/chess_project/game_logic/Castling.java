package com.web_chess.chess_project.game_logic;

import jakarta.persistence.Embeddable;


@Embeddable
public class Castling {
    Boolean blackKingMove;
    Boolean blackRookKingSide;
    Boolean blackRookQueenSide;
    Boolean whiteKingMove;
    Boolean whiteRookKingSide;
    Boolean whiteRookQueenSide;


    public Boolean isBlackKingMove() {
        return this.blackKingMove;
    }

    public Boolean getBlackKingMove() {
        return this.blackKingMove;
    }

    public void setBlackKingMove(Boolean blackKingMove) {
        this.blackKingMove = blackKingMove;
    }

    public Boolean isBlackRookKingSide() {
        return this.blackRookKingSide;
    }

    public Boolean getBlackRookKingSide() {
        return this.blackRookKingSide;
    }

    public void setBlackRookKingSide(Boolean blackRookKingSide) {
        this.blackRookKingSide = blackRookKingSide;
    }

    public Boolean isBlackRookQueenSide() {
        return this.blackRookQueenSide;
    }

    public Boolean getBlackRookQueenSide() {
        return this.blackRookQueenSide;
    }

    public void setBlackRookQueenSide(Boolean blackRookQueenSide) {
        this.blackRookQueenSide = blackRookQueenSide;
    }

    public Boolean isWhiteKingMove() {
        return this.whiteKingMove;
    }

    public Boolean getWhiteKingMove() {
        return this.whiteKingMove;
    }

    public void setWhiteKingMove(Boolean whiteKingMove) {
        this.whiteKingMove = whiteKingMove;
    }

    public Boolean isWhiteRookKingSide() {
        return this.whiteRookKingSide;
    }

    public Boolean getWhiteRookKingSide() {
        return this.whiteRookKingSide;
    }

    public void setWhiteRookKingSide(Boolean whiteRookKingSide) {
        this.whiteRookKingSide = whiteRookKingSide;
    }

    public Boolean isWhiteRookQueenSide() {
        return this.whiteRookQueenSide;
    }

    public Boolean getWhiteRookQueenSide() {
        return this.whiteRookQueenSide;
    }

    public void setWhiteRookQueenSide(Boolean whiteRookQueenSide) {
        this.whiteRookQueenSide = whiteRookQueenSide;
    }


    public Castling() {
        this.blackKingMove = false;
        this.blackRookKingSide = false;
        this.blackRookQueenSide = false;
        this.whiteKingMove = false;
        this.whiteRookKingSide = false;
        this.whiteRookQueenSide = false;
    }
}
